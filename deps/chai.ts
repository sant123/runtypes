import chaiImport from "https://esm.sh/chai@4.3.4";

const chaiStatic: typeof chai = chaiImport;

export const { expect } = chaiStatic;
export default chaiStatic;
