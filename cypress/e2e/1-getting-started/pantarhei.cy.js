/// <reference types="cypress" />

describe("Panta Rhei tasks", () => {
  beforeEach(() => {
    cy.setCookie("user_allowed_save_cookie", "%7B%221%22%3A1%7D");

    cy.intercept(
      "GET",
      "https://www.pantarhei.sk/static/version1669332086/frontend/Panta/default/sk_SK/Magento_Ui/templates/modal/modal-popup.html"
    ).as("modalPopUp");

    cy.intercept(
      "GET",
      "https://www.pantarhei.sk/catalogsearch/result/index/?q=Zaklinac&amshopby%5Bstock_availability%5D%5B%5D=5730&shopbyAjax=1"
    ).as("stockAvailability");

    cy.intercept(
      "GET",
      "https://www.pantarhei.sk/catalogsearch/result/index/?p=2&q=Zaklinac"
    ).as("pagination");

    // cy.visit("https://www.pantarhei.sk");
  });

  it("Task-#1 - Search", () => {
    const searchItem = "Zaklínač";

    cy.visit("https://www.pantarhei.sk");

    cy.wait("@modalPopUp");

    cy.get("#s-autocomplete").type(`${searchItem}`);
    cy.get("#search_mini_form").find("button").click();

    cy.location().should((loc) => {
      expect(loc.search).to.eq("?q=Zakl%C3%ADna%C4%8D");
      expect(loc.pathname).to.eq("/catalogsearch/result/");
    });

    cy.get("#amasty-shopby-product-list .product-list")
      .find("[itemtype='https://schema.org/Book']")
      .should("have.length", 19)
      .and("contain.text", "Zaklínač");
  });

  it("Task-#2 - Filter", () => {
    cy.visit("https://www.pantarhei.sk/catalogsearch/result/?q=Zaklinac");

    cy.wait(6000);

    cy.get(".filter-listing .am-filter-items-stock_availability")
      .find("label")
      .first()
      .should("contains.text", "Na sklade")
      .click({ force: true });

    // cy.wait(6000);

    cy.wait("@stockAvailability").then((interception) => {
      cy.get(".filter-listing .am-filter-items-stock_availability")
        .find("input")
        .first()
        .should("be.checked");

      cy.url().should("include", "&stock_availability=5730");

      cy.get("#amasty-shopby-product-list .product-list")
        .find(".status")
        .should("have.length", 19)
        .and("contain.text", "Na sklade");
    });
  });

  it("Task-#3 - Pagination", () => {
    cy.visit("https://www.pantarhei.sk/catalogsearch/result/?q=Zaklinac");

    cy.wait("@modalPopUp");
    // cy.wait(6000);

    cy.get("#amasty-shopby-product-list .pages")
      .find("a")
      .first()
      .should("contains.text", "Ďalšia strana")
      .click();

    // cy.wait(6000);

    cy.wait("@pagination").then((interception) => {
      cy.get(".pagination")
        .find(".page-item")
        .eq(2)
        .should("have.class", "active")
        .and("contains.text", "2");

      cy.location().should((loc) => {
        expect(loc.host).to.eq("www.pantarhei.sk");
        expect(loc.search).to.eq("?p=2&q=Zaklinac");
      });
    });
  });
});
