import { describe, it, expect } from "vitest";
import { Name } from "../../../src/adap-b01/names/Name";

describe("Basic initialization tests", () => {
  it("test construction with default delimiter", () => {
    let n: Name = new Name(["oss", "cs", "fau", "de"]);
    expect(n.asString()).toBe("oss.cs.fau.de");
  });

  it("test construction with custom delimiter", () => {
    let n: Name = new Name(["oss", "cs", "fau", "de"], "/");
    expect(n.asString()).toBe("oss/cs/fau/de");
  });

  it("test construction with empty components", () => {
    let n: Name = new Name(["", "", ""]);
    expect(n.asString()).toBe("..");
  });
});

describe("Basic function tests", () => {
  it("test insert", () => {
    let n: Name = new Name(["oss", "fau", "de"]);
    n.insert(1, "cs");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });

  it("test append", () => {
    let n: Name = new Name(["oss", "cs", "fau"]);
    n.append("de");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });

  it("test remove", () => {
    let n: Name = new Name(["oss", "cs", "fau", "de"]);
    n.remove(0);
    expect(n.asString()).toBe("cs.fau.de");
  });

  it("test getComponent", () => {
    let n: Name = new Name(["oss", "cs", "fau", "de"]);
    expect(n.getComponent(0)).toBe("oss");
    expect(n.getComponent(2)).toBe("fau");
  });

  it("test setComponent", () => {
    let n: Name = new Name(["oss", "cs", "fau", "de"]);
    n.setComponent(1, "wiai");
    expect(n.asString()).toBe("oss.wiai.fau.de");
  });

  it("test getNoComponents", () => {
    let n: Name = new Name(["oss", "cs", "fau", "de"]);
    expect(n.getNoComponents()).toBe(4);
  });
});

describe("Delimiter function tests", () => {
  it("test asString with different delimiter", () => {
    let n: Name = new Name(["oss", "cs", "fau", "de"]);
    expect(n.asString("-")).toBe("oss-cs-fau-de");
  });

  it("test operations with custom delimiter", () => {
    let n: Name = new Name(["oss", "fau", "de"], '#');
    n.insert(1, "cs");
    expect(n.asString()).toBe("oss#cs#fau#de");
  });
});

describe("asDataString tests", () => {
  it("test asDataString with default delimiter", () => {
    let n: Name = new Name(["oss", "cs", "fau", "de"]);
    expect(n.asDataString()).toBe("oss.cs.fau.de");
  });

  it("test asDataString with custom delimiter", () => {
    let n: Name = new Name(["oss", "cs", "fau", "de"], "/");
    expect(n.asDataString()).toBe("oss.cs.fau.de");
  });

  it("test asDataString unmasks and remasks", () => {
    let n: Name = new Name(["oss\\.cs", "fau", "de"]);
    // Component is "oss\.cs" (escaped dot)
    // unmask: "oss.cs", then re-mask for ".": "oss\.cs"
    expect(n.asDataString()).toBe("oss\\.cs.fau.de");
  });
});

describe("Masking tests", () => {
  it("test component with escaped delimiter", () => {
    let n: Name = new Name(["oss\\.cs", "fau", "de"]);
    expect(n.asString()).toBe("oss.cs.fau.de");
    expect(n.getNoComponents()).toBe(3);
  });

  it("test component with escaped backslash", () => {
    let n: Name = new Name(["oss\\\\cs", "fau", "de"]);
    expect(n.asString()).toBe("oss\\cs.fau.de");
  });
});

describe("Error handling tests", () => {
  it("test getComponent with invalid index", () => {
    let n: Name = new Name(["oss", "cs", "fau", "de"]);
    expect(() => n.getComponent(-1)).toThrow(RangeError);
    expect(() => n.getComponent(4)).toThrow(RangeError);
  });

  it("test setComponent with invalid index", () => {
    let n: Name = new Name(["oss", "cs", "fau", "de"]);
    expect(() => n.setComponent(-1, "test")).toThrow(RangeError);
    expect(() => n.setComponent(4, "test")).toThrow(RangeError);
  });

  it("test setComponent with null", () => {
    let n: Name = new Name(["oss", "cs", "fau", "de"]);
    expect(() => n.setComponent(0, null as any)).toThrow(TypeError);
  });

  it("test insert with invalid index", () => {
    let n: Name = new Name(["oss", "cs", "fau", "de"]);
    expect(() => n.insert(-1, "test")).toThrow(RangeError);
    expect(() => n.insert(5, "test")).toThrow(RangeError);
  });

  it("test insert with null", () => {
    let n: Name = new Name(["oss", "cs", "fau", "de"]);
    expect(() => n.insert(0, null as any)).toThrow(TypeError);
  });

  it("test append with null", () => {
    let n: Name = new Name(["oss", "cs", "fau", "de"]);
    expect(() => n.append(null as any)).toThrow(TypeError);
  });

  it("test remove with invalid index", () => {
    let n: Name = new Name(["oss", "cs", "fau", "de"]);
    expect(() => n.remove(-1)).toThrow(RangeError);
    expect(() => n.remove(4)).toThrow(RangeError);
  });
});

describe("Edge cases", () => {
  it("test insert at boundaries", () => {
    let n: Name = new Name(["oss", "fau", "de"]);
    n.insert(0, "www");
    expect(n.asString()).toBe("www.oss.fau.de");
    expect(n.getNoComponents()).toBe(4);
  });

  it("test insert at end", () => {
    let n: Name = new Name(["oss", "cs"]);
    n.insert(2, "fau");
    expect(n.asString()).toBe("oss.cs.fau");
  });

  it("test remove last component", () => {
    let n: Name = new Name(["oss", "cs", "fau", "de"]);
    n.remove(3);
    expect(n.asString()).toBe("oss.cs.fau");
    expect(n.getNoComponents()).toBe(3);
  });

  it("test operations on single component", () => {
    let n: Name = new Name(["oss"]);
    n.append("cs");
    expect(n.getNoComponents()).toBe(2);
    n.remove(0);
    expect(n.getNoComponents()).toBe(1);
    expect(n.asString()).toBe("cs");
  });

  it("test empty array construction", () => {
    let n: Name = new Name([]);
    expect(n.getNoComponents()).toBe(0);
  });
});

describe("Method chaining tests", () => {
  it("test multiple inserts", () => {
    let n: Name = new Name(["fau", "de"]);
    n.insert(0, "cs");
    n.insert(0, "oss");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });

  it("test insert and remove", () => {
    let n: Name = new Name(["oss", "cs", "fau", "de"]);
    n.insert(2, "test");
    expect(n.getNoComponents()).toBe(5);
    n.remove(2);
    expect(n.asString()).toBe("oss.cs.fau.de");
  });

  it("test append and setComponent", () => {
    let n: Name = new Name(["oss", "cs"]);
    n.append("fau");
    n.append("de");
    n.setComponent(1, "informatik");
    expect(n.asString()).toBe("oss.informatik.fau.de");
  });

  it("test complex chaining with all operations", () => {
    let n: Name = new Name(["oss"]);
    n.append("cs");
    n.append("fau");
    n.insert(1, "informatik");
    n.setComponent(2, "cs");
    n.remove(3);
    n.insert(0, "www");
    n.append("de");
    expect(n.asString()).toBe("www.oss.informatik.cs.de");
    expect(n.getNoComponents()).toBe(5);
  });

  it("test chaining with custom delimiter", () => {
    let n: Name = new Name(["oss", "fau"], "#");
    n.append("de");
    n.insert(1, "cs");
    n.setComponent(0, "www");
    n.remove(2);
    n.append("de");
    expect(n.asString()).toBe("www#cs#de#de");
    expect(n.asString("-")).toBe("www-cs-de-de");
  });

  it("test chaining with masking", () => {
    let n: Name = new Name(["oss"]);
    n.append("cs\\.fau");
    n.insert(1, "www");
    n.setComponent(0, "www\\.oss");
    n.append("de");
    expect(n.asString()).toBe("www.oss.www.cs.fau.de");
    expect(n.getNoComponents()).toBe(4);
  });

  it("test chaining creating and removing components", () => {
    let n: Name = new Name([]);
    n.append("oss");
    n.append("cs");
    n.append("fau");
    n.insert(0, "www");
    n.remove(2);
    n.remove(1);
    n.setComponent(0, "fau");
    n.append("de");
    expect(n.asString()).toBe("fau.fau.de");
    expect(n.getNoComponents()).toBe(3);
  });

  it("test chaining with boundary operations", () => {
    let n: Name = new Name(["cs"]);
    n.insert(0, "oss");
    n.insert(2, "fau");
    n.setComponent(0, "www");
    n.setComponent(2, "de");
    n.remove(1);
    n.append("fau");
    expect(n.asString()).toBe("www.de.fau");
  });
});
