// プロジェクトの状態管理のクラス
class ProjectState {
  private listeners: any[] = [];
  private projects: any[] = [];
  private static instance: ProjectState;

  private constructor() {

  }

  // staticメソッド : クラスをインスタンス化しなくてもアクセスを許可する
  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ProjectState();
    return this.instance;
  }

  addListener(listenerFn: Function) {
    this.listeners.push(listenerFn);
    for (const listenerFn of this.listeners) {
      listenerFn(this.projects.slice());
    }
  }

  addProject(title: string, description: string, manday: number) {
    // オブジェクト作成
    const newProject = {
      id: Math.random().toString(),
      title: title,
      description: description,
      manday: manday
    }
    this.projects.push(newProject);
  }
}

const projectState = ProjectState.getInstance();

// バリデーションの型
interface Validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

// バリデーションの関数
function validate(validatableInput: Validatable) {
  // 値が渡されないかもしれないため初期値はtrue
  let isValid = true;

  // 必須チェックされていた場合
  if (validatableInput.required) {
    // valueに値が入力されていればtrue、未入力であればfalse
    isValid = isValid && validatableInput.value.toString().trim().length !== 0;
  }

  // 最小入力文字数のチェック
  // minLengthの値が設定されていて文字列型の場合、
  if (validatableInput.minLength != null && typeof validatableInput.value === 'string') {
    // 設定された値以上であればtrue
    isValid = isValid && validatableInput.value.length >= validatableInput.minLength;
  }

  // 最大入力文字数のチェック
  // maxLengthの値が設定されていて文字列型の場合、
  if (validatableInput.maxLength != null && typeof validatableInput.value === 'string') {
    // 設定された値以下であればtrue
    isValid = isValid && validatableInput.value.length <= validatableInput.maxLength;
  }

  // 最小値のチェック
  // minの値が設定されていて数値型の場合、
  if (validatableInput.min != null && typeof validatableInput.value === 'number') {
    // 設定された値以上であればtrue
    isValid = isValid && validatableInput.value >= validatableInput.min;
  }

  // 最大値のチェック
  // maxの値が設定されていて数値型の場合、
  if (validatableInput.max != null && typeof validatableInput.value === 'number') {
    // 設定された値以下であればtrue
    isValid = isValid && validatableInput.value <= validatableInput.max;
  }

  return isValid;
}

// autobind decorator
function AutoBind(_: any, _2: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      const boundFn = originalMethod.bind(this);
      return boundFn;
    }
  }
  return adjDescriptor;
}

// Projectリストを作成するクラス
class ProjectList {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLElement;
  assignedProjects: any[];

  // 引数で'active'か'finished'を受け取る
  constructor(private type: 'active' | 'finished') {
    this.templateElement = document.getElementById('project-list')! as HTMLTemplateElement;
    this.hostElement = document.getElementById('app')! as HTMLDivElement;
    this.assignedProjects = [];

    // importNode : 他の文書から Node または DocumentFragment の複製を作成する。
    // 第一引数にその対象のNodeを、第二引数は対象のNodeの配下のDOMもインポートするかどうか。標準はfalse
    const importedNode = document.importNode(this.templateElement.content, true);
    // 取得したNodeの最初の子要素（section）を elementプロパティに格納
    this.element = importedNode.firstElementChild as HTMLElement;
    // 動的に変わるid属性を付与
    this.element.id = `${this.type}-projects`;

    projectState.addListener((projects: any[]) => {
      this.assignedProjects = projects;
      this.renderProjects();
    });

    this.attach();
    this.renderContent();
  }

  private renderProjects() {
    const listEl = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement;
    for (const prjItem of this.assignedProjects) {
      const listItem = document.createElement('li');
      listItem.textContent = prjItem.title;
      listEl?.appendChild(listItem);
    }
  }

  private renderContent() {
    const listId = `${this.type}-projects-list`;
    // ul要素にidを付与
    this.element.querySelector('ul')!.id = listId;

    // typeがactiveの場合とfinishedの場合でh2タグのテキストを変えて付与
    this.element.querySelector('h2')!.textContent = this.type === 'active' ? '実行中プロジェクト' : '完了プロジェクト';
  }

  private attach() {
    // id="app"の要素（div）に <section> 要素を入れる。
    // insertAdjacentElement : appendChildに似ている。第一引数はその要素のどこに入れるか指定できる。ここでは終了タグの前
    this.hostElement.insertAdjacentElement('beforeend', this.element);
  }
}


// Projectを作成するクラス
class ProjectInput {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLFormElement;
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  mandayInputElement: HTMLInputElement;

  constructor() {
    this.templateElement = document.getElementById('project-input')! as HTMLTemplateElement;
    this.hostElement = document.getElementById('app')! as HTMLDivElement;

    // importNode : 他の文書から Node または DocumentFragment の複製を作成する。
    // 第一引数にその対象のNodeを、第二引数は対象のNodeの配下のDOMもインポートするかどうか。標準はfalse
    const importedNode = document.importNode(this.templateElement.content, true);
    // 取得したNodeの最初の子要素（Form）を elementプロパティに格納
    this.element = importedNode.firstElementChild as HTMLFormElement;
    // id属性を付与
    this.element.id = 'user-input';

    // formタグの中のそれぞれの要素を取得
    this.titleInputElement = this.element.querySelector('#title') as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector('#description') as HTMLInputElement;
    this.mandayInputElement = this.element.querySelector('#manday') as HTMLInputElement;


    this.configure();
    this.attach();
  }

  // formのそれぞれ入力値を取得するしてバリデーションを行う関数
  // 返り値はタプル型または値を返さないunion型を指定
  private gatherUserInput(): [string, string, number] | void {
    // 入力値を取得して変数に代入
    const enteredTitle = this.titleInputElement.value;
    const enteredDescription = this.descriptionInputElement.value;
    const enteredManday = this.mandayInputElement.value;

    // titleのValidatableオブジェクト
    const titleValidatable: Validatable = {
      value: enteredTitle,
      required: true,
    };

    // descriptionのValidatableオブジェクト
    const descriptionValidatable: Validatable = {
      value: enteredDescription,
      required: true,
      minLength: 5
    };

    // mandayのValidatableオブジェクト
    const mandayValidatable: Validatable = {
      value: +enteredManday,
      required: true,
      min: 1,
      max: 1000
    };

    //バリデーション
    // validate関数に引数としてオブジェクトを渡す
    if (
      !validate(titleValidatable) ||
      !validate(descriptionValidatable) ||
      !validate(mandayValidatable)
    ) {
      alert('入力値が正しくありません。再度お試しください。');
      return;
    } else {
      //成功したら入力値をタプル型で返す
      return [enteredTitle, enteredDescription, +enteredManday];
    }
  }

  // 入力値を殻にする関数
  private clearInputs() {
    this.titleInputElement.value = "";
    this.descriptionInputElement.value = "";
    this.mandayInputElement.value = "";
  }

  @AutoBind
  private submitHandler(e: Event) {
    e.preventDefault(); // httpリクエストが送られないようにする
    const userInput = this.gatherUserInput();
    //userInputに返された値が配列かどうかチェック
    if (Array.isArray(userInput)) {
      // 分割代入
      const [title, desc, manday] = userInput;
      projectState.addProject(title, desc, manday);
      // console.log(title, desc, manday)
      //入力値を空に
      this.clearInputs();
    }
  }

  private configure() {
    //form要素にイベントを追加。formが送信されたらsubmitHandler関数を実行
    this.element.addEventListener('submit', this.submitHandler);
  }

  private attach() {
    // id="app"の要素（div）に <form> 要素を入れる。
    // insertAdjacentElement : appendChildに似ている。第一引数はその要素のどこに入れるか指定できる。ここでは開始タグの直下
    this.hostElement.insertAdjacentElement('afterbegin', this.element);
  }


}

const prjInput = new ProjectInput();
const activePrjList = new ProjectList('active');
const finishedPrjList = new ProjectList('finished');