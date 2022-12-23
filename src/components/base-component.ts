// 処理を共通化するためにコンポーネントを作成
//Component Class
export abstract class Component<T extends HTMLElement, U extends HTMLElement> {
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
