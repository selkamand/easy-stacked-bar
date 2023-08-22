import { count } from "../src/utils";

test("check counting works", () => {
  const longData = [
    { x: "Patient1", gene: "BRCA1", type: "missense" },
    { x: "Patient2", gene: "BRCA1", type: "missense" },
    { x: "Patient3", gene: "BRCA1", type: "nonsense" },
    { x: "Patient4", gene: "BRCA1", type: "nonsense" },
    { x: "Patient5", gene: "TP53", type: "missense" },
    { x: "Patient6", gene: "TP53", type: "missense" },
    { x: "Patient6", gene: "TP53", type: "nonsense" },
  ];

  const expectedResult = [
    { gene: "BRCA1", missense: 2, nonsense: 2 },
    { gene: "TP53", missense: 2, nonsense: 1 },
  ];
  expect(count(longData, "gene", "type")).toStrictEqual(expectedResult);
});

test("check counting works with only category specified", () => {
  const longData = [
    { x: "Patient1", gene: "BRCA1", type: "missense" },
    { x: "Patient2", gene: "BRCA1", type: "missense" },
    { x: "Patient3", gene: "BRCA1", type: "nonsense" },
    { x: "Patient4", gene: "BRCA1", type: "nonsense" },
    { x: "Patient5", gene: "TP53", type: "missense" },
    { x: "Patient6", gene: "TP53", type: "missense" },
    { x: "Patient6", gene: "TP53", type: "nonsense" },
  ];

  const expectedResult = [
    { gene: "BRCA1", count: 4 },
    { gene: "TP53", count: 3 },
  ];
  expect(count(longData, "gene")).toStrictEqual(expectedResult);
});

test("check errors are thworn if column names aren't in data", () => {
  const longData = [
    { x: "Patient1", gene: "BRCA1", type: "missense" },
    { x: "Patient2", gene: "BRCA1", type: "missense" },
    { x: "Patient3", gene: "BRCA1", type: "nonsense" },
    { x: "Patient4", gene: "BRCA1", type: "nonsense" },
    { x: "Patient5", gene: "TP53", type: "missense" },
    { x: "Patient6", gene: "TP53", type: "missense" },
    { x: "Patient6", gene: "TP53", type: "nonsense" },
  ];

  const expectedResult = [
    { gene: "BRCA1", count: 4 },
    { gene: "TP53", count: 3 },
  ];
  expect(count(longData, "gene")).toStrictEqual(expectedResult);
});
