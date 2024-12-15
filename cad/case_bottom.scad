include <BOSL2/std.scad>

module case_bottom() {
    overlapBuffer = 1;
    union() {
        difference() {
            cuboid([130, 120, 32], rounding=5, except=TOP);
            translate([0, 0, 10.5 + overlapBuffer]) cube([122, 112, 11 + 2 * overlapBuffer], center=true);
            translate([0, 0, 0]) cube([110, 100, 16], center=true);
            translate([-38, -33, -8]) cylinder(r=11, h=4);
            translate([57.5 - overlapBuffer, -23, 0 + overlapBuffer]) cube([5 + 2 * overlapBuffer, 30, 10 + 2 * overlapBuffer], center=true);
            translate([60, -23, 0]) cube([30, 10, 9], center=true);
        }
        translate([-47, 42, -16]) cylinder(r=2, h=36.5);
        translate([47, 42, -16]) cylinder(r=2, h=36.5);
        translate([47, -42, -16]) cylinder(r=2, h=36.5);
    }
}

case_bottom();