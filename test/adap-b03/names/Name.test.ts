import { describe, it, expect } from "vitest";

import { Name } from "../../../src/adap-b03/names/Name";
import { StringName } from "../../../src/adap-b03/names/StringName";
import { StringArrayName } from "../../../src/adap-b03/names/StringArrayName";

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
});

describe("Clone tests", () => {
  it("test StringName clone", () => {
    let n: Name = new StringName("oss.cs.fau.de");
    let cloned = n.clone() as Name;
    expect(cloned.asString()).toBe("oss.cs.fau.de");
    expect(cloned.getNoComponents()).toBe(4);
    
    // Modify original, clone should not change
    n.append("www");
    expect(n.getNoComponents()).toBe(5);
    expect(cloned.getNoComponents()).toBe(4);
  });
  
  it("test StringArrayName clone", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
    let cloned = n.clone() as Name;
    expect(cloned.asString()).toBe("oss.cs.fau.de");
    expect(cloned.getNoComponents()).toBe(4);
    
    // Modify original, clone should not change
    n.append("www");
    expect(n.getNoComponents()).toBe(5);
    expect(cloned.getNoComponents()).toBe(4);
  });
});

describe("Equality and hashCode tests", () => {
  it("test isEqual with identical names", () => {
    let n1: Name = new StringName("oss.cs.fau.de");
    let n2: Name = new StringName("oss.cs.fau.de");
    expect(n1.isEqual(n2)).toBe(true);
  });
  
  it("test isEqual with different names", () => {
    let n1: Name = new StringName("oss.cs.fau.de");
    let n2: Name = new StringName("oss.fau.de");
    expect(n1.isEqual(n2)).toBe(false);
  });
  
  it("test isEqual between StringName and StringArrayName", () => {
    let n1: Name = new StringName("oss.cs.fau.de");
    let n2: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
    expect(n1.isEqual(n2)).toBe(true);
  });
  
  it("test hashCode consistency", () => {
    let n1: Name = new StringName("oss.cs.fau.de");
    let n2: Name = new StringName("oss.cs.fau.de");
    expect(n1.getHashCode()).toBe(n2.getHashCode());
  });
  
  it("test hashCode between StringName and StringArrayName", () => {
    let n1: Name = new StringName("oss.cs.fau.de");
    let n2: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
    expect(n1.getHashCode()).toBe(n2.getHashCode());
  });

  it("test equal objects must have same hashCode", () => {
    // Test the contract: a.isEqual(b) === true => a.getHashCode() === b.getHashCode()
    let pairs = [
      [new StringName("oss.cs.fau.de"), new StringName("oss.cs.fau.de")],
      [new StringArrayName(["oss", "cs"]), new StringArrayName(["oss", "cs"])],
      [new StringName("oss.cs"), new StringArrayName(["oss", "cs"])],
      [new StringName("a"), new StringName("a")],
      [new StringArrayName([]), new StringArrayName([])],
    ];
    
    for (let [n1, n2] of pairs) {
      if (n1.isEqual(n2)) {
        expect(n1.getHashCode()).toBe(n2.getHashCode());
      }
    }
  });
});

describe("Empty string edge cases", () => {
  it("test StringName with empty string has 1 component", () => {
    let n: Name = new StringName("");
    expect(n.getNoComponents()).toBe(1);
    expect(n.isEmpty()).toBe(false);
    expect(n.getComponent(0)).toBe("");
  });
  
  it("test StringName empty after remove", () => {
    let n: Name = new StringName("");
    n.remove(0);
    expect(n.getNoComponents()).toBe(0);
    expect(n.isEmpty()).toBe(true);
    expect(n.asString()).toBe("");
  });
  
  it("test StringArrayName with empty component", () => {
    let n: Name = new StringArrayName([""]);
    expect(n.getNoComponents()).toBe(1);
    expect(n.isEmpty()).toBe(false);
    expect(n.getComponent(0)).toBe("");
  });
  
  it("test StringArrayName truly empty", () => {
    let n: Name = new StringArrayName([]);
    expect(n.getNoComponents()).toBe(0);
    expect(n.isEmpty()).toBe(true);
  });
  
  it("test append to empty StringName after remove", () => {
    let n: Name = new StringName("");
    n.remove(0);
    expect(n.isEmpty()).toBe(true);
    n.append("first");
    expect(n.getNoComponents()).toBe(1);
    expect(n.asString()).toBe("first");
  });
});

describe("Method chaining and complex operations", () => {
  it("test multiple inserts", () => {
    let n: Name = new StringName("oss.de");
    n.insert(1, "cs");
    n.insert(2, "fau");
    expect(n.asString()).toBe("oss.cs.fau.de");
    expect(n.getNoComponents()).toBe(4);
  });
  
  it("test insert, append, remove chain", () => {
    let n: Name = new StringName("oss.fau");
    n.insert(1, "cs");
    n.append("de");
    n.remove(0);
    expect(n.asString()).toBe("cs.fau.de");
    expect(n.getNoComponents()).toBe(3);
  });
  
  it("test setComponent multiple times", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau"]);
    n.setComponent(0, "www");
    n.setComponent(1, "informatik");
    n.setComponent(2, "de");
    expect(n.asString()).toBe("www.informatik.de");
  });
  
  it("test concat operation", () => {
    let n1: Name = new StringName("oss.cs");
    let n2: Name = new StringName("fau.de");
    n1.concat(n2);
    expect(n1.asString()).toBe("oss.cs.fau.de");
    expect(n1.getNoComponents()).toBe(4);
  });
  
  it("test concat with empty name", () => {
    let n1: Name = new StringName("oss.cs");
    let n2: Name = new StringArrayName([]);
    n1.concat(n2);
    expect(n1.asString()).toBe("oss.cs");
    expect(n1.getNoComponents()).toBe(2);
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

describe("Error handling tests", () => {
  it("test getComponent with invalid index", () => {
    let n: Name = new StringName("oss.cs.fau");
    expect(() => n.getComponent(5)).toThrow(RangeError);
    expect(() => n.getComponent(-1)).toThrow(RangeError);
  });
  
  it("test setComponent with invalid index", () => {
    let n: Name = new StringArrayName(["oss", "cs"]);
    expect(() => n.setComponent(5, "test")).toThrow(RangeError);
    expect(() => n.setComponent(-1, "test")).toThrow(RangeError);
  });
  
  it("test remove with invalid index", () => {
    let n: Name = new StringName("oss.cs");
    expect(() => n.remove(5)).toThrow(RangeError);
    expect(() => n.remove(-1)).toThrow(RangeError);
  });
  
  it("test append with null", () => {
    let n: Name = new StringName("oss");
    expect(() => n.append(null as any)).toThrow(TypeError);
  });
  
  it("test insert with undefined", () => {
    let n: Name = new StringArrayName(["oss"]);
    expect(() => n.insert(0, undefined as any)).toThrow(TypeError);
  });
});

describe("Delimiter tests", () => {
  it("test custom delimiter in StringName", () => {
    let n: Name = new StringName("oss#cs#fau#de", '#');
    expect(n.getDelimiterCharacter()).toBe('#');
    expect(n.getNoComponents()).toBe(4);
    expect(n.asString()).toBe("oss#cs#fau#de");
  });
  
  it("test custom delimiter in StringArrayName", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau", "de"], '#');
    expect(n.getDelimiterCharacter()).toBe('#');
    expect(n.asString()).toBe("oss#cs#fau#de");
  });
});

describe("Escape character tests", () => {
  it("test escaped delimiter in component", () => {
    let n: Name = new StringName("oss.cs.fau.de", '#');
    expect(n.getNoComponents()).toBe(1);
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
});

describe("Empty to non-empty transitions", () => {
  it("test multiple add/remove cycles", () => {
    let n: Name = new StringArrayName([]);
    expect(n.isEmpty()).toBe(true);
    
    n.append("a");
    expect(n.isEmpty()).toBe(false);
    expect(n.getNoComponents()).toBe(1);
    
    n.remove(0);
    expect(n.isEmpty()).toBe(true);
    
    n.append("b");
    n.append("c");
    expect(n.getNoComponents()).toBe(2);
    
    n.remove(0);
    n.remove(0);
    expect(n.isEmpty()).toBe(true);
  });
});

describe("Interchangeability of StringName and StringArrayName", () => {
  it("test same operations produce same results", () => {
    let n1: Name = new StringName("oss.cs.fau.de");
    let n2: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
    
    expect(n1.asString()).toBe(n2.asString());
    expect(n1.getNoComponents()).toBe(n2.getNoComponents());
    expect(n1.isEqual(n2)).toBe(true);
  });
  
  it("test append produces same results", () => {
    let n1: Name = new StringName("oss.cs");
    let n2: Name = new StringArrayName(["oss", "cs"]);
    
    n1.append("fau");
    n2.append("fau");
    
    expect(n1.asString()).toBe(n2.asString());
    expect(n1.isEqual(n2)).toBe(true);
  });
  
  it("test insert produces same results", () => {
    let n1: Name = new StringName("oss.fau.de");
    let n2: Name = new StringArrayName(["oss", "fau", "de"]);
    
    n1.insert(1, "cs");
    n2.insert(1, "cs");
    
    expect(n1.asString()).toBe(n2.asString());
    expect(n1.isEqual(n2)).toBe(true);
  });
  
  it("test remove produces same results", () => {
    let n1: Name = new StringName("oss.cs.fau.de");
    let n2: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
    
    n1.remove(0);
    n2.remove(0);
    
    expect(n1.asString()).toBe(n2.asString());
    expect(n1.isEqual(n2)).toBe(true);
  });
  
  it("test setComponent produces same results", () => {
    let n1: Name = new StringName("oss.cs.fau.de");
    let n2: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
    
    n1.setComponent(1, "informatik");
    n2.setComponent(1, "informatik");
    
    expect(n1.asString()).toBe(n2.asString());
    expect(n1.isEqual(n2)).toBe(true);
  });
  
  it("test complex operation chain produces same results", () => {
    let n1: Name = new StringName("a.b");
    let n2: Name = new StringArrayName(["a", "b"]);
    
    n1.append("c");
    n2.append("c");
    n1.insert(1, "x");
    n2.insert(1, "x");
    n1.remove(0);
    n2.remove(0);
    n1.setComponent(0, "y");
    n2.setComponent(0, "y");
    
    expect(n1.asString()).toBe(n2.asString());
    expect(n1.getNoComponents()).toBe(n2.getNoComponents());
    expect(n1.isEqual(n2)).toBe(true);
  });
  
  it("test concat between different implementations", () => {
    let n1: Name = new StringName("oss.cs");
    let n2: Name = new StringArrayName(["fau", "de"]);
    
    n1.concat(n2);
    
    expect(n1.asString()).toBe("oss.cs.fau.de");
    expect(n1.getNoComponents()).toBe(4);
  });
  
  it("test concat in reverse direction", () => {
    let n1: Name = new StringArrayName(["oss", "cs"]);
    let n2: Name = new StringName("fau.de");
    
    n1.concat(n2);
    
    expect(n1.asString()).toBe("oss.cs.fau.de");
    expect(n1.getNoComponents()).toBe(4);
  });
  
  it("test clone preserves type and content", () => {
    let n1: Name = new StringName("oss.cs.fau.de");
    let cloned1 = n1.clone() as Name;
    
    let n2: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
    let cloned2 = n2.clone() as Name;
    
    expect(cloned1.isEqual(n1)).toBe(true);
    expect(cloned2.isEqual(n2)).toBe(true);
    expect(cloned1.isEqual(cloned2)).toBe(true);
  });
  
  it("test isEmpty behaves identically", () => {
    let n1: Name = new StringName("");
    let n2: Name = new StringArrayName([""]);
    
    expect(n1.isEmpty()).toBe(n2.isEmpty());
    expect(n1.getNoComponents()).toBe(n2.getNoComponents());
    
    n1.remove(0);
    n2.remove(0);
    
    expect(n1.isEmpty()).toBe(true);
    expect(n2.isEmpty()).toBe(true);
    expect(n1.isEqual(n2)).toBe(true);
  });
  
  it("test custom delimiter works identically", () => {
    let n1: Name = new StringName("oss#cs#fau#de", '#');
    let n2: Name = new StringArrayName(["oss", "cs", "fau", "de"], '#');
    
    expect(n1.asString()).toBe(n2.asString());
    expect(n1.getDelimiterCharacter()).toBe(n2.getDelimiterCharacter());
    expect(n1.isEqual(n2)).toBe(true);
  });
});

describe("Masking and escaping tests", () => {
  it("test escaped delimiter in StringName component", () => {
    let n: Name = new StringName("oss\\.cs.fau.de");
    expect(n.getNoComponents()).toBe(3);
    expect(n.getComponent(0)).toBe("oss\\.cs");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
  
  it("test component with delimiter gets masked in asDataString", () => {
    let n: Name = new StringArrayName(["oss.cs", "fau", "de"]);
    let dataString = n.asDataString();
    expect(dataString).toBe("oss\\.cs.fau.de");
  });
  
  it("test masking preserved through operations", () => {
    let n: Name = new StringName("a\\.b.c");
    n.append("d");
    expect(n.getNoComponents()).toBe(3);
    expect(n.getComponent(0)).toBe("a\\.b");
  });
});

describe("asDataString tests", () => {
  it("test asDataString with default delimiter", () => {
    let n: Name = new StringName("oss.cs.fau.de");
    expect(n.asDataString()).toBe("oss.cs.fau.de");
  });
  
  it("test asDataString with custom delimiter", () => {
    let n: Name = new StringName("oss#cs#fau#de", '#');
    expect(n.asDataString()).toBe("oss.cs.fau.de");
  });
  
  it("test asDataString conversion and reconstruction", () => {
    let n1: Name = new StringName("oss#cs#fau", '#');
    let dataString = n1.asDataString();
    let n2: Name = new StringName(dataString);
    expect(n2.getNoComponents()).toBe(3);
    expect(n2.asString()).toBe("oss.cs.fau");
  });
  
  it("test asDataString with StringArrayName", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau"], '#');
    expect(n.asDataString()).toBe("oss.cs.fau");
  });
});

describe("toString tests", () => {
  it("test toString equals asDataString for StringName", () => {
    let n: Name = new StringName("oss.cs.fau.de");
    expect(n.toString()).toBe(n.asDataString());
  });
  
  it("test toString equals asDataString for StringArrayName", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
    expect(n.toString()).toBe(n.asDataString());
  });
  
  it("test toString with custom delimiter", () => {
    let n: Name = new StringName("oss#cs#fau", '#');
    expect(n.toString()).toBe("oss.cs.fau");
  });
});

describe("getComponent edge cases", () => {
  it("test getComponent returns correct values after insert", () => {
    let n: Name = new StringName("a.c");
    n.insert(1, "b");
    expect(n.getComponent(0)).toBe("a");
    expect(n.getComponent(1)).toBe("b");
    expect(n.getComponent(2)).toBe("c");
  });
  
  it("test getComponent returns correct values after setComponent", () => {
    let n: Name = new StringArrayName(["a", "b", "c"]);
    n.setComponent(1, "x");
    expect(n.getComponent(0)).toBe("a");
    expect(n.getComponent(1)).toBe("x");
    expect(n.getComponent(2)).toBe("c");
  });
  
  it("test getComponent returns correct values after remove", () => {
    let n: Name = new StringName("a.b.c.d");
    n.remove(1);
    expect(n.getComponent(0)).toBe("a");
    expect(n.getComponent(1)).toBe("c");
    expect(n.getComponent(2)).toBe("d");
  });
  
  it("test getComponent with empty component", () => {
    let n: Name = new StringName("a..c");
    expect(n.getComponent(0)).toBe("a");
    expect(n.getComponent(1)).toBe("");
    expect(n.getComponent(2)).toBe("c");
  });
  
  it("test getComponent at boundary", () => {
    let n: Name = new StringArrayName(["a", "b", "c"]);
    expect(n.getComponent(0)).toBe("a");
    expect(n.getComponent(2)).toBe("c");
    expect(() => n.getComponent(3)).toThrow(RangeError);
  });
});

describe("getNoComponents edge cases", () => {
  it("test getNoComponents after multiple appends", () => {
    let n: Name = new StringName("");
    n.remove(0);
    expect(n.getNoComponents()).toBe(0);
    n.append("a");
    expect(n.getNoComponents()).toBe(1);
    n.append("b");
    expect(n.getNoComponents()).toBe(2);
  });
  
  it("test getNoComponents with consecutive empty components", () => {
    let n: Name = new StringName("...");
    expect(n.getNoComponents()).toBe(4);
  });
  
  it("test getNoComponents after concat", () => {
    let n1: Name = new StringName("a.b");
    let n2: Name = new StringName("c.d");
    n1.concat(n2);
    expect(n1.getNoComponents()).toBe(4);
  });
});

describe("asString with different delimiters", () => {
  it("test asString with same delimiter", () => {
    let n: Name = new StringName("oss.cs.fau.de");
    expect(n.asString(".")).toBe("oss.cs.fau.de");
  });
  
  it("test asString with different delimiter", () => {
    let n: Name = new StringName("oss.cs.fau.de");
    expect(n.asString("/")).toBe("oss/cs/fau/de");
  });
  
  it("test asString with empty string delimiter", () => {
    let n: Name = new StringArrayName(["a", "b", "c"]);
    expect(n.asString("")).toBe("abc");
  });
  
  it("test asString with multi-character delimiter", () => {
    let n: Name = new StringName("oss.cs.fau");
    expect(n.asString(" -> ")).toBe("oss -> cs -> fau");
  });
  
  it("test asString preserves empty components", () => {
    let n: Name = new StringName("a..b");
    expect(n.asString("-")).toBe("a--b");
  });
});

describe("Insert boundary tests", () => {
  it("test insert at start", () => {
    let n: Name = new StringName("b.c");
    n.insert(0, "a");
    expect(n.asString()).toBe("a.b.c");
  });
  
  it("test insert at end", () => {
    let n: Name = new StringArrayName(["a", "b"]);
    n.insert(2, "c");
    expect(n.asString()).toBe("a.b.c");
  });
  
  it("test insert into empty name", () => {
    let n: Name = new StringArrayName([]);
    n.insert(0, "a");
    expect(n.getNoComponents()).toBe(1);
    expect(n.asString()).toBe("a");
  });
  
  it("test insert beyond bounds throws error", () => {
    let n: Name = new StringName("a.b");
    expect(() => n.insert(5, "c")).toThrow(RangeError);
  });
});

describe("Concat edge cases", () => {
  it("test concat with itself", () => {
    let n: Name = new StringName("a.b");
    let clone = n.clone() as Name;
    n.concat(clone);
    expect(n.asString()).toBe("a.b.a.b");
  });
  
  it("test concat multiple times", () => {
    let n1: Name = new StringName("a");
    let n2: Name = new StringName("b");
    n1.concat(n2);
    n1.concat(n2);
    expect(n1.asString()).toBe("a.b.b");
  });
  
  it("test concat doesn't modify second name", () => {
    let n1: Name = new StringName("a");
    let n2: Name = new StringName("b");
    n1.concat(n2);
    expect(n2.asString()).toBe("b");
    expect(n2.getNoComponents()).toBe(1);
  });
});

describe("HashCode edge cases", () => {
  it("test hashCode is consistent across calls", () => {
    let n: Name = new StringName("oss.cs.fau.de");
    let hash1 = n.getHashCode();
    let hash2 = n.getHashCode();
    expect(hash1).toBe(hash2);
  });
  
  it("test hashCode changes after modification", () => {
    let n: Name = new StringName("a.b");
    let hash1 = n.getHashCode();
    n.append("c");
    let hash2 = n.getHashCode();
    expect(hash1).not.toBe(hash2);
  });
  
  it("test hashCode for empty name", () => {
    let n1: Name = new StringArrayName([]);
    let n2: Name = new StringName("");
    n2.remove(0);
    expect(n1.getHashCode()).toBe(n2.getHashCode());
  });
});
