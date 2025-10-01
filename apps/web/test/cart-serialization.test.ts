import { beforeEach, describe, expect, test } from "bun:test";
import {
  deserializeCart,
  generateShareableCartURL,
  serializeCart,
} from "../src/lib/cart-serialization";
import type { CartState, Service } from "../src/lib/cart-store";

// Mock window and location
const mockWindow = {
  location: {
    origin: "http://localhost:3001",
    pathname: "/",
    href: "http://localhost:3001/",
    search: "",
  },
};

(global as any).window = mockWindow;
(global as any).btoa = (str: string) => Buffer.from(str).toString("base64");
(global as any).atob = (str: string) => Buffer.from(str, "base64").toString();

describe("Cart Serialization", () => {
  const mockService: Service = {
    id: "service-1",
    name: "Test Service",
    price: 100000,
    description: "Test description",
  };

  const mockCartState: CartState = {
    items: [
      {
        service: mockService,
        quantity: 2,
        addedAt: 1234567890000,
      },
    ],
  };

  beforeEach(() => {
    mockWindow.location.search = "";
    mockWindow.location.href = "http://localhost:3001/";
  });

  test("should serialize cart state to base64 string", () => {
    const serialized = serializeCart(mockCartState);
    expect(serialized).toBeTruthy();
    expect(typeof serialized).toBe("string");

    // Should be base64 encoded
    expect(() => atob(serialized)).not.toThrow();
  });

  test("should deserialize cart data from base64 string", () => {
    const serialized = serializeCart(mockCartState);
    const deserialized = deserializeCart(serialized);

    expect(deserialized).toHaveLength(1);
    expect(deserialized[0].service.id).toBe("service-1");
    expect(deserialized[0].service.name).toBe("Test Service");
    expect(deserialized[0].service.price).toBe(100000);
    expect(deserialized[0].quantity).toBe(2);
  });

  test("should generate shareable URL without tenant (default)", () => {
    const shareableURL = generateShareableCartURL(mockCartState);
    expect(shareableURL).toContain("cart=");
  });

  test("should generate shareable URL with tenant", () => {
    const shareableURL = generateShareableCartURL(mockCartState, "runa");
    expect(shareableURL).toContain("cart_runa=");
  });

  test("should generate shareable URL with main tenant (explicit)", () => {
    const shareableURL = generateShareableCartURL(mockCartState, "main");
    expect(shareableURL).toContain("cart=");
  });
  test("should handle empty cart", () => {
    const emptyCart: CartState = { items: [] };
    const serialized = serializeCart(emptyCart);
    expect(serialized).toBe("");

    const deserialized = deserializeCart("");
    expect(deserialized).toHaveLength(0);
  });

  test("should handle invalid serialized data gracefully", () => {
    const deserialized = deserializeCart("invalid-data");
    expect(deserialized).toHaveLength(0);

    const deserializedEmpty = deserializeCart("");
    expect(deserializedEmpty).toHaveLength(0);
  });

  test("should round-trip correctly (serialize then deserialize)", () => {
    const serialized = serializeCart(mockCartState);
    const deserialized = deserializeCart(serialized);
    const reSerialized = serializeCart({ items: deserialized });

    // Should produce the same result when serialized again
    const reDeserialized = deserializeCart(reSerialized);
    expect(reDeserialized).toEqual(deserialized);
  });
});
