include <BOSL2/std.scad>

module case_top() {
    difference() {
        union() {
            cuboid([125, 115, 5]);
            translate([93.75, 28.75, 0]) rotate([90, 90, 0]) wedge([5, 62.5, 57.5], center=true);
            translate([-93.75, -28.75, 0]) rotate([0, 90, 90]) wedge([5, 62.5, 57.5], center=true);
        }
        translate([-24, -10, -10]) cube([44, 34, 20]);
        translate([-38, -33, -1]) cylinder(r=20, h=5, center=true);
        translate([-38, -33, 2]) cylinder(r=18, h=2, center=true);
        translate([-42, 37, -1]) cylinder(r=2, h=8, center=true);
        translate([42, 37, -1]) cylinder(r=2, h=8, center=true);
        translate([42, -42, -1]) cylinder(r=2, h=8, center=true);
    }
}

case_top();