export function safeDefine(tag: string, ctor: CustomElementConstructor): void {
  if (customElements.get(tag)) {
    return;
  }
  customElements.define(tag, ctor);
}
