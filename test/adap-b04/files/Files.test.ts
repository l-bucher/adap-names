import { describe, it, expect } from "vitest";

import { IllegalArgumentException } from "../../../src/adap-b04/common/IllegalArgumentException";

import { File } from "../../../src/adap-b04/files/File";
import { Directory } from "../../../src/adap-b04/files/Directory";
import { Link } from "../../../src/adap-b04/files/Link";
import { RootNode } from "../../../src/adap-b04/files/RootNode";

describe("Basic Node tests", () => {
  it("create node with valid base name", () => {
    const rn = RootNode.getRootNode();
    const dir = new Directory("cat_videos", rn);
    expect(dir.getBaseName()).toBe("cat_videos");
  });

  it("rename node with valid name", () => {
    const rn = RootNode.getRootNode();
    const dir = new Directory("test", rn);
    dir.rename("newname");
    expect(dir.getBaseName()).toBe("newname");
  });

  it("move node to different directory", () => {
    const rn = RootNode.getRootNode();
    const dir1 = new Directory("recycle_bin", rn);
    const dir2 = new Directory("top_secret", rn);
    const file = new File("death_star_plans.pdf", dir1);
    
    file.move(dir2);
    expect(file.getParentNode()).toBe(dir2);
  });
});

describe("Node Contract Tests - Preconditions", () => {
  it("constructor throws on null base name", () => {
    const rn = RootNode.getRootNode();
    expect(() => new Directory(null as any, rn)).toThrow(IllegalArgumentException);
  });

  it("constructor throws on undefined base name", () => {
    const rn = RootNode.getRootNode();
    expect(() => new Directory(undefined as any, rn)).toThrow(IllegalArgumentException);
  });

  it("constructor throws on empty base name", () => {
    const rn = RootNode.getRootNode();
    expect(() => new Directory("", rn)).toThrow(IllegalArgumentException);
  });

  it("constructor throws on null parent", () => {
    expect(() => new Directory("test", null as any)).toThrow(IllegalArgumentException);
  });

  it("RootNode with empty base name succeeds", () => {
    // RootNode is allowed to have empty base name
    expect(() => RootNode.getRootNode()).not.toThrow();
    const rn = RootNode.getRootNode();
    expect(rn.getBaseName()).toBe("");
  });

  it("rename throws on null base name", () => {
    const rn = RootNode.getRootNode();
    const dir = new Directory("test", rn);
    expect(() => dir.rename(null as any)).toThrow(IllegalArgumentException);
  });

  it("rename throws on empty base name", () => {
    const rn = RootNode.getRootNode();
    const dir = new Directory("test", rn);
    expect(() => dir.rename("")).toThrow(IllegalArgumentException);
  });

  it("move throws on null target", () => {
    const rn = RootNode.getRootNode();
    const dir = new Directory("test", rn);
    expect(() => dir.move(null as any)).toThrow(IllegalArgumentException);
  });
});

describe("File Contract Tests - State-based Preconditions", () => {
  it("open file that is closed succeeds", () => {
    const rn = RootNode.getRootNode();
    const dir = new Directory("documents", rn);
    const file = new File("world_domination_plans.txt", dir);
    
    expect(() => file.open()).not.toThrow();
  });

  it("open already opened file throws", () => {
    const rn = RootNode.getRootNode();
    const dir = new Directory("pics", rn);
    const file = new File("baby_yoda.jpg", dir);
    
    file.open();
    expect(() => file.open()).toThrow(IllegalArgumentException);
  });

  it("read from opened file succeeds", () => {
    const rn = RootNode.getRootNode();
    const dir = new Directory("test", rn);
    const file = new File("test.txt", dir);
    
    file.open();
    expect(() => file.read(10)).not.toThrow();
  });

  it("read from closed file throws", () => {
    const rn = RootNode.getRootNode();
    const dir = new Directory("test", rn);
    const file = new File("test.txt", dir);
    
    expect(() => file.read(10)).toThrow(IllegalArgumentException);
  });

  it("read with negative bytes throws", () => {
    const rn = RootNode.getRootNode();
    const dir = new Directory("test", rn);
    const file = new File("test.txt", dir);
    
    file.open();
    expect(() => file.read(-1)).toThrow(IllegalArgumentException);
  });

  it("close opened file succeeds", () => {
    const rn = RootNode.getRootNode();
    const dir = new Directory("test", rn);
    const file = new File("test.txt", dir);
    
    file.open();
    expect(() => file.close()).not.toThrow();
  });

  it("close already closed file throws", () => {
    const rn = RootNode.getRootNode();
    const dir = new Directory("test", rn);
    const file = new File("test.txt", dir);
    
    expect(() => file.close()).toThrow(IllegalArgumentException);
  });

  it("file state transitions correctly: closed -> open -> closed", () => {
    const rn = RootNode.getRootNode();
    const dir = new Directory("test", rn);
    const file = new File("test.txt", dir);
    
    // Initial state: closed
    expect(() => file.read(10)).toThrow(IllegalArgumentException);
    
    // Open it
    file.open();
    expect(() => file.read(10)).not.toThrow();
    
    // Close it
    file.close();
    expect(() => file.read(10)).toThrow(IllegalArgumentException);
  });
});

describe("Directory Contract Tests", () => {
  it("add child node succeeds", () => {
    const rn = RootNode.getRootNode();
    const dir = new Directory("parent", rn);
    const child = new File("child.txt", dir);
    
    expect(dir.hasChildNode(child)).toBe(true);
  });

  it("add null child throws", () => {
    const rn = RootNode.getRootNode();
    const dir = new Directory("test", rn);
    
    expect(() => dir.addChildNode(null as any)).toThrow(IllegalArgumentException);
  });

  it("remove existing child succeeds", () => {
    const rn = RootNode.getRootNode();
    const dir1 = new Directory("dir1", rn);
    const dir2 = new Directory("dir2", rn);
    const file = new File("test.txt", dir1);
    
    expect(dir1.hasChildNode(file)).toBe(true);
    
    // Move file (removes from dir1, adds to dir2)
    file.move(dir2);
    
    expect(dir1.hasChildNode(file)).toBe(false);
    expect(dir2.hasChildNode(file)).toBe(true);
  });

  it("remove non-existing child throws", () => {
    const rn = RootNode.getRootNode();
    const dir1 = new Directory("dir1", rn);
    const dir2 = new Directory("dir2", rn);
    const file = new File("test.txt", dir2);
    
    expect(() => dir1.removeChildNode(file)).toThrow(IllegalArgumentException);
  });
});

describe("Link Contract Tests", () => {
  it("create link with target node", () => {
    const rn = RootNode.getRootNode();
    const dir = new Directory("test", rn);
    const file = new File("target.txt", dir);
    const link = new Link("link", dir, file);
    
    expect(link.getTargetNode()).toBe(file);
  });

  it("create link without target node", () => {
    const rn = RootNode.getRootNode();
    const dir = new Directory("test", rn);
    const link = new Link("link", dir);
    
    expect(link.getTargetNode()).toBe(null);
  });

  it("set target node succeeds", () => {
    const rn = RootNode.getRootNode();
    const dir = new Directory("test", rn);
    const file = new File("target.txt", dir);
    const link = new Link("link", dir);
    
    link.setTargetNode(file);
    expect(link.getTargetNode()).toBe(file);
  });

  it("set null target throws", () => {
    const rn = RootNode.getRootNode();
    const dir = new Directory("test", rn);
    const link = new Link("link", dir);
    
    expect(() => link.setTargetNode(null as any)).toThrow(IllegalArgumentException);
  });

  it("getBaseName on link with target returns target base name", () => {
    const rn = RootNode.getRootNode();
    const dir = new Directory("test", rn);
    const file = new File("target.txt", dir);
    const link = new Link("link", dir, file);
    
    expect(link.getBaseName()).toBe("target.txt");
  });

  it("getBaseName on link without target throws", () => {
    const rn = RootNode.getRootNode();
    const dir = new Directory("test", rn);
    const link = new Link("link", dir);
    
    expect(() => link.getBaseName()).toThrow(IllegalArgumentException);
  });

  it("rename on link with target renames target", () => {
    const rn = RootNode.getRootNode();
    const dir = new Directory("test", rn);
    const file = new File("target.txt", dir);
    const link = new Link("link", dir, file);
    
    link.rename("newname.txt");
    expect(file.getBaseName()).toBe("newname.txt");
    expect(link.getBaseName()).toBe("newname.txt");
  });

  it("rename on link without target throws", () => {
    const rn = RootNode.getRootNode();
    const dir = new Directory("test", rn);
    const link = new Link("link", dir);
    
    expect(() => link.rename("newname")).toThrow(IllegalArgumentException);
  });
});
