class DepthReading {
  constructor({id, hole_id, depth, dip, azimuth, trustworthy}) {
    this.id = id || '';
    this.hole_id = hole_id || 0;
    this.depth = depth || 0;
    this.dip = dip || 0;
    this.azimuth = azimuth || 0;
    this.trustworthy = trustworthy || false;
  }
}

export default DepthReading;
