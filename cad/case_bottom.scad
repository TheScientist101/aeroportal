include <BOSL2/std.scad>

module case_bottom() {
    overlapBuffer = 1;
    union() {
        translate([93.75, 28.75, 0]) rotate([90, 90, 0]) wedge([32, 62.5, 57.5], center=true);
        translate([-93.75, -28.75, 0]) rotate([0, 90, 90]) wedge([32, 62.5, 57.5], center=true);
        difference() {
            cuboid([125, 115, 32]);
            translate([0, 0, 10.5 + overlapBuffer]) cube([120, 110, 11 + 2 * overlapBuffer], center=true);
            translate([0, 0, 0]) cube([100, 90, 16], center=true);
            translate([-38, -33, -8]) cylinder(r=11, h=4);
            translate([60, -23, 0]) cuboid([30, 10, 9], rounding=3, except=[RIGHT, LEFT]);
        }
        translate([-42, 37, -16]) cylinder(r=2, h=36.5);
        translate([42, 37, -16]) cylinder(r=2, h=36.5);
        translate([42, -42, -16]) cylinder(r=2, h=36.5);
    }
}

case_bottom();