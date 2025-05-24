const customDarkStyles = {
  control: (base) => ({
    ...base,
    backgroundColor: "#2e2e2e",
    color: "white",
    borderColor: "#555",
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: "#2e2e2e",
    color: "white",
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? "#444" : "#2e2e2e",
    color: "white",
  }),
  singleValue: (base) => ({
    ...base,
    color: "white",
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: "#444",
    color: "white",
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: "white",
  }),
  multiValueRemove: (base) => ({
    ...base,
    color: "white",
    ":hover": {
      backgroundColor: "#555",
      color: "white",
    },
  }),
};

export default customDarkStyles;
