var Add = require("../app");

describe("Add functionality", () => {
	it("calculates x + y = z", () => {
		expect(Add(10,5)).toEqual(15)
	});
});