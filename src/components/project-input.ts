import { Component } from "./base-component.js";
import { Validatable, validate } from "../util/validation.js";
import { AutoBind } from "../decorators/autobind.js";
import { projectState } from "../state/project-state.js";

// Projectを作成するクラス
export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
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
