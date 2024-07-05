export const mapConfig = {
  map: {
    width: 1900,
    height: 900,
  },
  islands: [
    {
      start: 0.5,
      end: 4.5,
      x: 660,
      y: 620,
      width: "400px",
      height: "400px",
      image: "puzzle-island.png",
    },

    {
      start: 4.6,
      end: 9.8,
      x: 60,
      y: 880,
      width: "400px",
      height: "400px",
      image: "dolls-island.png",
    },
    {
      x: 620,
      y: 1050,
      width: "150px",
      height: "150px",
      image: "x.png",
    },
  ],
  ship: {
    image: "ship.png",
    width: 200,
    height: 200,
    path: "M829.582 2C829.582 2 549.602 283 858.101 393C1166.6 503 1090.5 540 1166.6 656.5C1242.7 773 1076.03 1012 829.601 1012C439.424 937.421 475.007 592 293.066 590.5C111.125 589 137.483 783 23.0053 960C-91.4724 1137 314.983 1435.5 487.025 1245C659.067 1054.5 635.5 1182.5 660.507 1145.5",
  },
};
