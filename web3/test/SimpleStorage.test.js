const SimpleStorage = artifacts.require("SimpleStorage");

contract("SimpleStorage", (accounts) => {
  it("should store and retrieve data", async () => {
    const instance = await SimpleStorage.new();

    await instance.set(42);
    const storedData = await instance.storedData();

    assert.equal(storedData.toString(), "42", "Stored data does not match");
  });
});
