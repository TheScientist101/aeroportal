use <case_bottom.scad>
use <case_top.scad>
use <speaker.scad>

color("green") translate([0, 0, 5]) import("./components/aeroportal.stl");
color("black") translate([-38, -33, 6]) speaker();
color("yellow") translate([0, 0, 18]) case_top();
color("black") case_bottom();