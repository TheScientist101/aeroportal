include <BOSL2/std.scad>

module case_top() {
    difference() {
        cuboid([130, 120, 5], rounding=5, except=BOTTOM);
        translate([-24, -10, -10]) cube([44, 34, 20]);
        translate([-38, -33, -1]) cylinder(r=20, h=5, center=true);
        translate([-38, -33, 2]) cylinder(r=18, h=2, center=true);
        translate([-47, 42, -1]) cylinder(r=2, h=8, center=true);
        translate([47, 42, -1]) cylinder(r=2, h=8, center=true);
        translate([47, -42, -1]) cylinder(r=2, h=8, center=true);
    }
}

case_top();