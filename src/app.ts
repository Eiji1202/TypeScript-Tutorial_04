// ドラッグ＆ドロップ
interface Draggable {
  dragStartHandler(event: DragEvent): void;
  dragEndHandler(event: DragEvent): void;
}

interface DragTarget {
  dragOverHandler(event: DragEvent): void;
  dropHandler(event: DragEvent): void;
  dragLeaveHandler(event: DragEvent): void;
}

// Project type
enum ProjectStatus {
  Active,
  Finished,
}

class Project {
  constructor(public id: string, public title: string, public description: string, public manday: number, public status: ProjectStatus) {}
}

// プロジェクトの状態管理のクラス
// Project State Management
type Listener<T> = (items: T[]) => void;

class State<T> {
  protected listeners: Listener<T>[] = [];

  addListener(listenerFn: Listener<T>) {
    this.listeners.push(listenerFn);
  }
}

class ProjectState extends State<Project> {
  private projects: Project[] = [];
  private static instance: ProjectState;

  private constructor() {
    super();
  }

  // staticメソッド : クラスをインスタンス化しなくてもアクセスを許可する
  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ProjectState();
    return this.instance;
  }

  addProject(title: string, description: string, manday: number) {
    // オブジェクト作成
    const newProject = new Project(Math.random().toString(), title, description, manday, ProjectStatus.Active);
    this.projects.push(newProject);
    this.updateListeners();
  }

  moveProject(projectId: string, newStatus: ProjectStatus) {
    const project = this.projects.find((prj) => prj.id === projectId);
    if (project && project.status !== newStatus) {
      project.status = newStatus;
      this.updateListeners();
    }
  }

  private updateListeners() {
    for (const listenerFn of this.listeners) {
      listenerFn(this.projects.slice());
    }
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
  if (validatableInput.minLength != null && typeof validatableInput.value === "string") {
    // 設定された値以上であればtrue
    isValid = isValid && validatableInput.value.length >= validatableInput.minLength;
  }

  // 最大入力文字数のチェック
  // maxLengthの値が設定されていて文字列型の場合、
  if (validatableInput.maxLength != null && typeof validatableInput.value === "string") {
    // 設定された値以下であればtrue
    isValid = isValid && validatableInput.value.length <= validatableInput.maxLength;
  }

  // 最小値のチェック
  // minの値が設定されていて数値型の場合、
  if (validatableInput.min != null && typeof validatableInput.value === "number") {
    // 設定された値以上であればtrue
    isValid = isValid && validatableInput.value >= validatableInput.min;
  }

  // 最大値のチェック
  // maxの値が設定されていて数値型の場合、
  if (validatableInput.max != null && typeof validatableInput.value === "number") {
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
    },
  };
  return adjDescriptor;
}

// 処理を共通化するためにコンポーネントを作成
//Component Class
abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  templateElement: HTMLTemplateElement;
  hostElement: T;
  element: U;

  constructor(templateId: string, hostElementId: string, insertAtStart: boolean, newElementId?: string) {
    this.templateElement = document.getElementById(templateId)! as HTMLTemplateElement;
    this.hostElement = document.getElementById(hostElementId)! as T;

    // importNode : 他の文書から Node または DocumentFragment の複製を作成する。
    // 第一引数にその対象のNodeを、第二引数は対象のNodeの配下のDOMもインポートするかどうか。標準はfalse
    const importedNode = document.importNode(this.templateElement.content, true);
    // 取得したNodeの最初の子要素を elementプロパティに格納
    this.element = importedNode.firstElementChild as U;
    if (newElementId) {
      this.element.id = newElementId;
    }

    this.attach(insertAtStart);
  }

  abstract configure(): void;
  abstract renderContent(): void;

  private attach(insertAtBeginning: boolean) {
    this.hostElement.insertAdjacentElement(insertAtBeginning ? "afterbegin" : "beforeend", this.element);
  }
}

// ProjectItem Class
class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> implements Draggable {
  private project: Project;

  get manday() {
    if (this.project.manday < 20) {
      return this.project.manday.toString() + "人日";
    } else {
      return (this.project.manday / 20).toString() + "人月";
    }
  }

  constructor(hostId: string, project: Project) {
    super("single-project", hostId, false, project.id);
    this.project = project;

    this.configure();
    this.renderContent();
  }

  @AutoBind
  dragStartHandler(event: DragEvent) {
    event.dataTransfer!.setData("text/plain", this.project.id);
    event.dataTransfer!.effectAllowed = "move";
  }

  dragEndHandler(_: DragEvent) {
    console.log("Drag終了");
  }

  configure() {
    this.element.addEventListener("dragstart", this.dragStartHandler);
    this.element.addEventListener("dragend", this.dragEndHandler);
  }

  renderContent() {
    this.element.querySelector("h2")!.textContent = this.project.title;
    // getter関数を実行
    this.element.querySelector("h3")!.textContent = this.manday;
    this.element.querySelector("p")!.textContent = this.project.description;
  }
}

// Projectリストを作成するクラス
// Componentクラスを継承
class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DragTarget {
  assignedProjects: Project[];

  // 引数で'active'か'finished'を受け取る
  constructor(private type: "active" | "finished") {
    super("project-list", "app", false, `${type}-projects`);
    this.assignedProjects = [];

    this.configure();
    this.renderContent();
  }

  @AutoBind
  dragOverHandler(event: DragEvent): void {
    if (event.dataTransfer && event.dataTransfer.types[0] === "text/plain") {
      event.preventDefault();
      const listEl = this.element.querySelector("ul")!;
      listEl.classList.add("droppable");
    }
  }

  @AutoBind
  dropHandler(event: DragEvent): void {
    const prjId = event.dataTransfer!.getData("text/plain");
    projectState.moveProject(prjId, this.type === "active" ? ProjectStatus.Active : ProjectStatus.Finished);
  }

  @AutoBind
  dragLeaveHandler(_: DragEvent): void {
    const listEl = this.element.querySelector("ul")!;
    listEl.classList.remove("droppable");
  }

  configure() {
    this.element.addEventListener("dragover", this.dragOverHandler);
    this.element.addEventListener("drop", this.dropHandler);
    this.element.addEventListener("dragleave", this.dragLeaveHandler);

    projectState.addListener((projects: Project[]) => {
      const relevantProjects = projects.filter((prj) => {
        if (this.type === "active") {
          return prj.status === ProjectStatus.Active;
        }
        return prj.status === ProjectStatus.Finished;
      });
      this.assignedProjects = relevantProjects;
      this.renderProjects();
    });
  }

  renderContent() {
    const listId = `${this.type}-projects-list`;
    // ul要素にidを付与
    this.element.querySelector("ul")!.id = listId;

    // typeがactiveの場合とfinishedの場合でh2タグのテキストを変えて付与
    this.element.querySelector("h2")!.textContent = this.type === "active" ? "実行中プロジェクト" : "完了プロジェクト";
  }

  private renderProjects() {
    const listEl = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement;
    listEl.innerHTML = "";
    for (const prjItem of this.assignedProjects) {
      new ProjectItem(listEl.id, prjItem);
    }
  }
}

// Projectを作成するクラス
class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  mandayInputElement: HTMLInputElement;

  constructor() {
    super("project-input", "app", true, "user-input");

    // formタグの中のそれぞれの要素を取得
    this.titleInputElement = this.element.querySelector("#title") as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector("#description") as HTMLInputElement;
    this.mandayInputElement = this.element.querySelector("#manday") as HTMLInputElement;

    this.configure();
  }

  public configure() {
    //form要素にイベントを追加。formが送信されたらsubmitHandler関数を実行
    this.element.addEventListener("submit", this.submitHandler);
  }

  renderContent() {}

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
      minLength: 5,
    };

    // mandayのValidatableオブジェクト
    const mandayValidatable: Validatable = {
      value: +enteredManday,
      required: true,
      min: 1,
      max: 1000,
    };

    //バリデーション
    // validate関数に引数としてオブジェクトを渡す
    if (!validate(titleValidatable) || !validate(descriptionValidatable) || !validate(mandayValidatable)) {
      alert("入力値が正しくありません。再度お試しください。");
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
}

const prjInput = new ProjectInput();
const activePrjList = new ProjectList("active");
const finishedPrjList = new ProjectList("finished");
