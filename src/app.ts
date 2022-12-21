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

  // 値の入力チェック
  if (validatableInput.required) {
    // 入力されていればtrue、未入力であればfalse
    isValid = isValid && validatableInput.value.toString().trim().length !== 0;
  }

  // 最小入力文字数のチェック
  // minLengthの値が設定されていて文字列型の場合、
  if (validatableInput.minLength !== undefined && typeof validatableInput.value === 'string') {
    // 設定された値以上であればtrue
    isValid = isValid && validatableInput.value.length >= validatableInput.minLength;
  }

  // 最大入力文字数のチェック
  // maxLengthの値が設定されていて文字列型の場合、
  if (validatableInput.maxLength !== undefined && typeof validatableInput.value === 'string') {
    // 設定された値以下であればtrue
    isValid = isValid && validatableInput.value.length <= validatableInput.maxLength;
  }

  // 最小値のチェック
  // minの値が設定されていて数値型の場合、
  if (validatableInput.min !== undefined && typeof validatableInput.value === 'number') {
    // 設定された値以上であればtrue
    isValid = isValid && validatableInput.value >= validatableInput.min;
  }

  // 最大値のチェック
  // maxの値が設定されていて数値型の場合、
  if (validatableInput.max !== undefined && typeof validatableInput.value === 'number') {
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


// ProjectInput Class
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

    // titleのバリデーションオブジェクト
    const titleValidatable: Validatable = {
      value: enteredTitle,
      required: true,
    }
    // descriptionのバリデーションオブジェクト
    const descriptionValidatable: Validatable = {
      value: enteredDescription,
      required: true,
      minLength: 5
    }
    // mandayのバリデーションオブジェクト
    const mandayValidatable: Validatable = {
      value: +enteredManday,
      required: true,
      min: 1,
      max: 1000
    }

    //バリデーション
    // validate関数に引数としてオブジェクトを渡す
    if (
      validate(titleValidatable) ||
      validate(descriptionValidatable) ||
      validate(mandayValidatable)
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
      console.log(title, desc, manday);
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