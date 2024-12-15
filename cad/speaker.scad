module speaker() {
    cylinder(r=11, h=7, center=true);
    translate([0,0,7]) cylinder(r1=18, r2=20, h=13, center=true);
}

speaker();