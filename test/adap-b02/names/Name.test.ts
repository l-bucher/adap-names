import { describe, it, expect } from "vitest";

import { Name } from "../../../src/adap-b02/names/Name";
import { StringName } from "../../../src/adap-b02/names/StringName";
import { StringArrayName } from "../../../src/adap-b02/names/StringArrayName";

describe("Basic StringName function tests", () => {
  it("test insert", () => {
    let n: Name = new StringName("oss.fau.de");
    n.insert(1, "cs");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
  
  it("test append", () => {
    let n: Name = new StringName("oss.cs.fau");
    n.append("de");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
  
  it("test remove", () => {
    let n: Name = new StringName("oss.cs.fau.de");
    n.remove(0);
    expect(n.asString()).toBe("cs.fau.de");
  });

  it("test insert on empty name after remove", () => {
    let n: Name = new StringName("");
    n.remove(0);
    n.insert(0, "oss");
    expect(n.asString()).toBe("oss");
    expect(n.getNoComponents()).toBe(1);
  });

  it("test getComponent", () => {
    let n: Name = new StringName("oss.cs.fau.de");
    expect(n.getComponent(0)).toBe("oss");
    expect(n.getComponent(2)).toBe("fau");
  });

  it("test setComponent", () => {
    let n: Name = new StringName("oss.cs.fau.de");
    n.setComponent(1, "informatik");
    expect(n.asString()).toBe("oss.informatik.fau.de");
  });

  it("test getNoComponents", () => {
    let n: Name = new StringName("oss.cs.fau.de");
    expect(n.getNoComponents()).toBe(4);
  });

  it("test concat", () => {
    let n1: Name = new StringName("oss.cs");
    let n2: Name = new StringName("fau.de");
    n1.concat(n2);
    expect(n1.asString()).toBe("oss.cs.fau.de");
  });
});

describe("Basic StringArrayName function tests", () => {
  it("test insert", () => {
    let n: Name = new StringArrayName(["oss", "fau", "de"]);
    n.insert(1, "cs");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
  
  it("test append", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau"]);
    n.append("de");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
  
  it("test remove", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
    n.remove(0);
    expect(n.asString()).toBe("cs.fau.de");
  });

  it("test getComponent", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
    expect(n.getComponent(0)).toBe("oss");
    expect(n.getComponent(2)).toBe("fau");
  });

  it("test setComponent", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
    n.setComponent(1, "wiai");
    expect(n.asString()).toBe("oss.wiai.fau.de");
  });

  it("test getNoComponents", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
    expect(n.getNoComponents()).toBe(4);
  });

  it("test concat", () => {
    let n1: Name = new StringArrayName(["oss", "cs"]);
    let n2: Name = new StringArrayName(["fau", "de"]);
    n1.concat(n2);
    expect(n1.asString()).toBe("oss.cs.fau.de");
  });
});

describe("isEmpty tests", () => {
  it("test StringName isEmpty after construction", () => {
    let n: Name = new StringName("");
    expect(n.isEmpty()).toBe(false);
    expect(n.getNoComponents()).toBe(1);
  });

  it("test StringName isEmpty after remove", () => {
    let n: Name = new StringName("");
    n.remove(0);
    expect(n.isEmpty()).toBe(true);
    expect(n.getNoComponents()).toBe(0);
  });

  it("test StringArrayName isEmpty", () => {
    let n: Name = new StringArrayName([]);
    expect(n.isEmpty()).toBe(true);
    n.append("test");
    expect(n.isEmpty()).toBe(false);
  });
});

describe("Delimiter function tests", () => {
  it("test asString with different delimiter", () => {
    let n: Name = new StringName("oss.cs.fau.de");
    expect(n.asString("-")).toBe("oss-cs-fau-de");
  });

  it("test operations with custom delimiter", () => {
    let n: Name = new StringName("oss#fau#de", '#');
    n.insert(1, "cs");
    expect(n.asString()).toBe("oss#cs#fau#de");
  });

  it("test getDelimiterCharacter", () => {
    let n1: Name = new StringName("oss.cs");
    let n2: Name = new StringName("oss#cs", '#');
    expect(n1.getDelimiterCharacter()).toBe(".");
    expect(n2.getDelimiterCharacter()).toBe("#");
  });
});

describe("asDataString tests", () => {
  it("test asDataString with default delimiter", () => {
    let n: Name = new StringName("oss.cs.fau.de");
    expect(n.asDataString()).toBe("oss.cs.fau.de");
  });

  it("test asDataString with custom delimiter", () => {
    let n: Name = new StringName("oss/cs/fau/de", "/");
    expect(n.asDataString()).toBe("oss.cs.fau.de");
  });

  it("test asDataString unmasks and remasks", () => {
    let n: Name = new StringName("oss\\.cs.fau.de");
    expect(n.asDataString()).toBe("oss\\.cs.fau.de");
  });

  it("test StringArrayName asDataString", () => {
    let n: Name = new StringArrayName(["oss\\.cs", "fau", "de"]);
    expect(n.asDataString()).toBe("oss\\.cs.fau.de");
  });
});

describe("Masking tests", () => {
  it("test component with escaped delimiter", () => {
    let n: Name = new StringName("oss\\.cs.fau.de");
    expect(n.getNoComponents()).toBe(3);
    expect(n.asString()).toBe("oss.cs.fau.de");
  });

  it("test component with escaped backslash", () => {
    let n: Name = new StringName("oss\\\\cs.fau.de");
    expect(n.asString()).toBe("oss\\cs.fau.de");
  });

  it("test escape and delimiter boundary conditions", () => {
    let n: Name = new StringName("oss.cs.fau.de", '#');
    expect(n.getNoComponents()).toBe(1);
    expect(n.asString()).toBe("oss.cs.fau.de");
    n.append("people");
    expect(n.asString()).toBe("oss.cs.fau.de#people");
  });
});

describe("Error handling tests", () => {
  it("test getComponent with invalid index", () => {
    let n: Name = new StringName("oss.cs.fau.de");
    expect(() => n.getComponent(-1)).toThrow(RangeError);
    expect(() => n.getComponent(4)).toThrow(RangeError);
  });

  it("test setComponent with invalid index", () => {
    let n: Name = new StringName("oss.cs.fau.de");
    expect(() => n.setComponent(-1, "test")).toThrow(RangeError);
    expect(() => n.setComponent(4, "test")).toThrow(RangeError);
  });

  it("test setComponent with null", () => {
    let n: Name = new StringName("oss.cs.fau.de");
    expect(() => n.setComponent(0, null as any)).toThrow(TypeError);
  });

  it("test insert with invalid index", () => {
    let n: Name = new StringName("oss.cs.fau.de");
    expect(() => n.insert(-1, "test")).toThrow(RangeError);
    expect(() => n.insert(5, "test")).toThrow(RangeError);
  });

  it("test insert with null", () => {
    let n: Name = new StringName("oss.cs.fau.de");
    expect(() => n.insert(0, null as any)).toThrow(TypeError);
  });

  it("test append with null", () => {
    let n: Name = new StringName("oss.cs.fau.de");
    expect(() => n.append(null as any)).toThrow(TypeError);
  });

  it("test remove with invalid index", () => {
    let n: Name = new StringName("oss.cs.fau.de");
    expect(() => n.remove(-1)).toThrow(RangeError);
    expect(() => n.remove(4)).toThrow(RangeError);
  });
});

describe("Edge cases", () => {
  it("test insert at boundaries", () => {
    let n: Name = new StringName("oss.fau.de");
    n.insert(0, "www");
    expect(n.asString()).toBe("www.oss.fau.de");
    expect(n.getNoComponents()).toBe(4);
  });

  it("test insert at end", () => {
    let n: Name = new StringName("oss.cs");
    n.insert(2, "fau");
    expect(n.asString()).toBe("oss.cs.fau");
  });

  it("test remove last component", () => {
    let n: Name = new StringName("oss.cs.fau.de");
    n.remove(3);
    expect(n.asString()).toBe("oss.cs.fau");
    expect(n.getNoComponents()).toBe(3);
  });

  it("test operations on single component", () => {
    let n: Name = new StringName("oss");
    n.append("cs");
    expect(n.getNoComponents()).toBe(2);
    n.remove(0);
    expect(n.getNoComponents()).toBe(1);
    expect(n.asString()).toBe("cs");
  });

  it("test empty string with multiple dots", () => {
    let n: Name = new StringName("...");
    expect(n.getNoComponents()).toBe(4);
  });

  it("test concat with empty name", () => {
    let n1: Name = new StringName("oss.cs");
    let n2: Name = new StringArrayName([]);
    n1.concat(n2);
    expect(n1.asString()).toBe("oss.cs");
  });
});

describe("Method chaining tests", () => {
  it("test multiple inserts", () => {
    let n: Name = new StringName("fau.de");
    n.insert(0, "cs");
    n.insert(0, "oss");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });

  it("test insert and remove", () => {
    let n: Name = new StringName("oss.cs.fau.de");
    n.insert(2, "www");
    expect(n.getNoComponents()).toBe(5);
    n.remove(2);
    expect(n.asString()).toBe("oss.cs.fau.de");
  });

  it("test append and setComponent", () => {
    let n: Name = new StringName("oss.cs");
    n.append("fau");
    n.append("de");
    n.setComponent(1, "informatik");
    expect(n.asString()).toBe("oss.informatik.fau.de");
  });

  it("test concat and append", () => {
    let n1: Name = new StringName("oss");
    let n2: Name = new StringName("cs");
    n1.concat(n2);
    n1.append("fau");
    expect(n1.asString()).toBe("oss.cs.fau");
  });

  it("test complex chaining with all operations", () => {
    let n: Name = new StringName("oss");
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
    let n: Name = new StringName("oss#fau", "#");
    n.append("de");
    n.insert(1, "cs");
    n.setComponent(0, "www");
    n.remove(2);
    n.append("de");
    expect(n.asString()).toBe("www#cs#de#de");
    expect(n.asString("-")).toBe("www-cs-de-de");
  });

  it("test chaining with concat", () => {
    let n1: Name = new StringName("oss.cs");
    let n2: Name = new StringArrayName(["fau", "de"]);
    n1.concat(n2);
    n1.insert(2, "www");
    n1.remove(2);
    n1.setComponent(1, "informatik");
    expect(n1.asString()).toBe("oss.informatik.fau.de");
  });

  it("test chaining creating and removing components", () => {
    let n: Name = new StringArrayName([]);
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
});

describe("Interchangeability tests", () => {
  it("test StringName and StringArrayName produce same results", () => {
    let n1: Name = new StringName("oss.cs.fau.de");
    let n2: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
    
    expect(n1.asString()).toBe(n2.asString());
    expect(n1.getNoComponents()).toBe(n2.getNoComponents());
  });

  it("test operations produce same results", () => {
    let n1: Name = new StringName("oss.cs");
    let n2: Name = new StringArrayName(["oss", "cs"]);
    
    n1.append("fau");
    n2.append("fau");
    
    expect(n1.asString()).toBe(n2.asString());
  });

  it("test concat between different types", () => {
    let n1: Name = new StringName("oss.cs");
    let n2: Name = new StringArrayName(["fau", "de"]);
    n1.concat(n2);
    expect(n1.asString()).toBe("oss.cs.fau.de");
  });

  it("test StringName constructor throws on empty delimiter", () => {
    expect(() => new StringName("test", "")).toThrow(RangeError);
  });

  it("test StringName constructor throws on multi-character delimiter", () => {
    expect(() => new StringName("test", "ab")).toThrow(RangeError);
  });

  it("test StringArrayName constructor throws on empty delimiter", () => {
    expect(() => new StringArrayName(["test"], "")).toThrow(RangeError);
  });

  it("test StringArrayName constructor throws on multi-character delimiter", () => {
    expect(() => new StringArrayName(["test"], "ab")).toThrow(RangeError);
  });
});
