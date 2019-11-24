import React from "react";
import { shallow } from "enzyme";

import App from "../pages/index";

describe("Pages", () => {
  describe("Index", () => {
    it("Shows 0 at begining", () => {
      const app = shallow(<App />);

      expect(app.find("p").text()).toEqual("0");
    });
  });
});
