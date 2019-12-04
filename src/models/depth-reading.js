class DepthReading {
  constructor({id, timestamp, depth, dip, azimuth, incorrect}) {
    this.id = id || '';
    this.timestamp = timestamp || null;
    this.depth = depth || 0;
    this.dip = dip || 0;
    this.azimuth = azimuth || 0;
    this.incorrect = incorrect || false;
  }
}

export default DepthReading;
