const defaultTheme = {
  palette: {
    primary: {
      main: "#ead4aa",
    },
    secondary: {
      main: "#ead4aa",
    },
    normal: {
      main: "#ead4aa",
    },
    woodcutting: {
      main: "#b86f50",
    },
    mining: {
      main: "#c0cbdc",
    },
    attacking: {
      main: "#e43b44",
    },
  },
  components: {
    MuiTypography: {
      defaultProps: {
        color: "#FFFFFF",
        // style: {
        //   color: "#FFFFFF",
        // },
      },
    },
    MuiButton: {
      defaultProps: {
        variant: "contained",
        style: {
          "&:hover": {
            color: "#181425",
            backgroundColor: "#e4a672",
          },
        },
      },
      variants: [
        {
          props: { variant: "blue" },
          style: {
            textTransform: "none",
            border: `2px dashed blue`,
            "&:hover": {
              color: "#181425",
              backgroundColor: "#00ff00",
            },
          },
        },
        {
          props: { variant: "red" },
          style: {
            border: `4px dashed red`,
            "&:hover": {
              color: "#181425",
              backgroundColor: "#00bb00",
            },
          },
        },
      ],
    },
  },
};

export default defaultTheme;
