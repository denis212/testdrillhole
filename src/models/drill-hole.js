class DrillHole {
  constructor({id, name, lat, lng, dip, azimuth}) {
    this.id = id || Math.random();
    this.name = name || '';
    this.lat = lat || 0;
    this.lng = lng || 0;
    this.dip = dip || 0;
    this.azimuth = azimuth || 0;
  }
}

export default DrillHole;
