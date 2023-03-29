import { ndArray_class, chunkedArray_class, texImage_class } from './ndarray.js';
import { inflate } from './pako.mod.js';

function Quaternion(data) {
  if (data instanceof Float64Array) {
    this.data = data;
  } else {
    this.data = new Float64Array(4);
  }
}

/**
 * Returns a rotation matrix representation of this quaternion.
 *
 * @returns {SFMatrix4} a new rotation matrix representing
 *                      this quaternion's rotation
 */
Quaternion.prototype.toSFMatrix4f = function ()
{
  const data = this.data;
  const xx = data[0] * data[0];
  const xy = data[0] * data[1];
  const xz = data[0] * data[2];
  const yy = data[1] * data[1];
  const yz = data[1] * data[2];
  const zz = data[2] * data[2];
  const wx = data[3] * data[0];
  const wy = data[3] * data[1];
  const wz = data[3] * data[2];
  return new SFMatrix4f( new Float64Array([
      1 - 2 * ( yy + zz ), 2 * ( xy - wz ), 2 * ( xz + wy ), 0,
      2 * ( xy + wz ), 1 - 2 * ( xx + zz ), 2 * ( yz - wx ), 0,
      2 * ( xz - wy ), 2 * ( yz + wx ), 1 - 2 * ( xx + yy ), 0,
      0, 0, 0, 1]
  ) );
};

/**
 * Sets this quaternion's components from the supplied rotation matrix,
 * and returns the quaternion itself.
 *
 * @param {SFMatrix4f} matrix - the rotation matrix whose
 *                              rotation shall be copied
 *                              into this quaternion
 * @returns {Quaternion} this modified quaternion
 */
Quaternion.prototype.fromSFMatrix4f = function ( A ) {
  const data = this.data;
  const aData = A.data;
  let s = 1;
  let qt = [ 0, 0, 0 ];
  let i = 0,
      j = 0,
      k = 0;
  let nxt = [ 1, 2, 0 ];
  let tr = aData[0] + aData[5] + aData[10];
  if ( tr > 0.0 ) {
    s = Math.sqrt( tr + 1.0 );
    data[3] = s * 0.5; // this.w
    s = 0.5 / s;
    data[0] = ( aData[9] - aData[6] ) * s;
    data[1] = ( aData[2] - aData[8] ) * s;
    data[2] = ( aData[4] - aData[1] ) * s;
  } else {
    if ( aData[5] > aData[0] ) {
      i = 1;
    } else {
      i = 0;
    }
    if ( aData[10] > aData[4*i+i] ) {
      i = 2;
    }
    j = nxt[ i ];
    k = nxt[ j ];
    s = Math.sqrt( aData[4*i+i] - ( aData[4*j+j] + aData[4*k+k] ) + 1.0 );
    qt[ i ] = s * 0.5;
    s = 0.5 / s;
    data[3] = ( aData[4*k+j] - aData[4*j+k] ) * s;
    qt[ j ] = ( aData[4*j+i] + aData[4*i+j] ) * s;
    qt[ k ] = ( aData[4*k+i] + aData[4*i+k] ) * s;

    data[0] = qt[0];
    data[1] = qt[1];
    data[2] = qt[2];
  }

  if ( data[3] > 1.0 || data[3] < -1.0 ) {
    const errThreshold = 1 + 1e-4; // ( x3dom.fields.Eps * 100 )
    if ( data[3] > errThreshold || data[3] < -errThreshold ) {
      // When copying, then everything, incl. the famous OpenSG MatToQuat bug
      console.warn( "MatToQuat: BUG: |quat[4]| (" + data[3] + ") >> 1.0 !" );
    }
    if ( data[3] > 1.0 ) {
      data[3] = 1.0;
    } else {
      data[3] = -1.0;
    }
  }
  return this;
}

export function SFMatrix4f(data) {
  if (data instanceof Float64Array) {
    this.data = data;
  } else {
    this.data = new Float64Array(16);
  }
}

SFMatrix4f.prototype.get = function (i,j) {
  return this.data[4*i+j];
}

SFMatrix4f.prototype.fromMatrix = function (A) {
  const aData = new Float64Array(16);
  let k=0;
  for (let i=0; i<4; i++) {
    const row = A[i];
    for (let j=0; j<4; j++) {
      aData[k] = row[j];
      k++;
    }
  }
  this.data = aData;
  return this;
}

SFMatrix4f.prototype.asMatrix = function () {
  const data = this.data;
  const A = []
  let k=0;
  for (let i=0; i<4; i++) {
    const row = A[i] = []
    for (let j=0; j<4; j++) {
      row[j] = data[k];
      k++;
    }
  }
  return A;
}

/**
 * Returns a SFMatrix4f identity matrix.
 *
 * @returns {SFMatrix4f} the new identity matrix
 */
SFMatrix4f.prototype.identity = function () {
  return new SFMatrix4f( new Float64Array([
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  ]) );
}

/**
 * Returns a transposed version of this matrix.
 *
 * @returns {SFMatrix4f} resulting matrix
 */
SFMatrix4f.prototype.transpose = function () {
  const data = this.data;
  const aData = new Float64Array(16);
  for (let i=0; i<4; i++) {
    for (let j=0; j<4; j++) {
      const k1 = 4*i+j;
      const k2 = 4*j+i;
      aData[k2] = data[k1];
    }
  }
  return new SFMatrix4f(aData);
}

/**
 * Returns a scaled version of this matrix.
 *
 * @param {Number} s - scale factor
 * @returns {x3dom.fields.SFMatrix4f} resulting matrix
 */
SFMatrix4f.prototype.multiply = function ( s ) {
  const aData = this.data.slice(0);
  for (let k=0; k<16; k++) aData[k] *= s;
  return new SFMatrix4f(aData);
};

/**
 * Returns the result of multiplying this matrix with the given one,
 * using "post-multiplication" / "right multiply".
 *
 * @param {SFMatrix4f} that - matrix to multiply with this
 *                                         one
 * @returns {x3dom.fields.SFMatrix4f} resulting matrix
 */
SFMatrix4f.prototype.matmul = function ( A ) {
  const data = this.data;
  const aData = A.data;
  const bData = this.data.slice(0);
  for (let i=0; i<4; i++) {
    for (let j=0; j<4; j++) {
      bData[4*i+j] = data[4*i+0]*aData[0+j] +
                     data[4*i+1]*aData[4+j] +
                     data[4*i+2]*aData[8+j] +
                     data[4*i+3]*aData[12+j];
    }
  }
  return new SFMatrix4f(bData);
}  

/**
 * Transforms a given 3D vector, using this matrix as a homogenous
 * transform matrix.
 *
 * @param {SFVec3f} vec - vector to transform
 * @returns {SFVec3f} resulting vector
 */
SFMatrix4f.prototype.multMatrixVec = function ( vec ) {
  const data = this.data;
  return [
    data[0]*vec[0]+data[1]*vec[1]+data[2]*vec[2],
    data[4]*vec[0]+data[5]*vec[1]+data[6]*vec[2],
    data[8]*vec[0]+data[9]*vec[1]+data[10]*vec[2]
  ]
}

/**
 * Returns the result of adding the given matrix to this matrix
 * using an additional scale factor for the argument matrix.
 *
 * @param {SFMatrix4f} A - the other matrix
 * @param {Number} s - the scale factor
 * @returns {SFMatrix4f} resulting matrix
 */
SFMatrix4f.prototype.addScaled = function ( A, s ) {
  const bData = this.data.slice(0);
  const aData = A.data;
  for (let k=0; k<16; k++) bData[k] += aData[k]*s;
  return new SFMatrix4f(bData);
};

/**
 * Returns the 1-norm of the upper left 3x3 part of this matrix.
 * The 1-norm is also known as maximum absolute column sum norm.
 *
 * @returns {Number} the resulting number
 */
SFMatrix4f.prototype.norm1_3x3 = function () {
  const data = this.data;
  let max = Math.abs( data[0] ) +
              Math.abs( data[4] ) +
              Math.abs( data[8] );
  let t = 0;
  if ( ( t = Math.abs( data[1] ) +
             Math.abs( data[5] ) +
             Math.abs( data[9] ) ) > max ) {
    max = t;
  }
  if ( ( t = Math.abs( data[2] ) +
             Math.abs( data[6] ) +
             Math.abs( data[10] ) ) > max ) {
    max = t;
  }
  return max;
}

/**
 * Returns the infinity-norm of the upper left 3x3 part of this matrix.
 * The infinity-norm is also known as maximum absolute row sum norm.
 *
 * @returns {Number} the resulting number
 */
SFMatrix4f.prototype.normInf_3x3 = function () {
  const data = this.data;
  let max = Math.abs( data[0] ) +
              Math.abs( data[1] ) +
              Math.abs( data[2] );
  let t = 0;
  if ( ( t = Math.abs( data[4] ) +
             Math.abs( data[5] ) +
             Math.abs( data[6] ) ) > max ) {
    max = t;
  }
  if ( ( t = Math.abs( data[8] ) +
             Math.abs( data[9] ) +
             Math.abs( data[10] ) ) > max ) {
    max = t;
  }
  return max;
}

/**
 * Computes the transposed adjoint of the upper left 3x3 part of this
 * matrix, and stores it in the upper left part of a new 4x4 identity
 * matrix.
 *
 * @returns {x3dom.fields.SFMatrix4f} the resulting matrix
 */
SFMatrix4f.prototype.adjointT_3x3 = function () {
  const data = this.data;
  const A = this.identity();
  const aData = A.data;
  
  aData[0] = data[5] * data[10] - data[6] * data[9];
  aData[1] = data[6] * data[8] - data[4] * data[10];
  aData[2] = data[4] * data[9] - data[5] * data[8];

  aData[4] = data[9] * data[2] - data[10] * data[1];
  aData[5] = data[10] * data[0] - data[8] * data[2];
  aData[6] = data[8] * data[1] - data[9] * data[0];

  aData[8] = data[1] * data[6] - data[2] * data[5];
  aData[9] = data[2] * data[4] - data[0] * data[6];
  aData[10] = data[0] * data[5] - data[1] * data[4];

  return A;
};


/**
 * Performs a polar decomposition of the 3x3 part of this matrix A 
 * into two matrices Q and S, so that A = QS.
 * 
 * @param {SFMatrix4f} Q - first resulting matrix
 * @param {SFMatrix4f} S - second resulting matrix
 * @returns {Number} determinant of the transposed adjoint upper 3x3
 *                   matrix
 */
SFMatrix4f.prototype.polarDecompose = function ( )
{
    const TOL = 0.000000000001;

    let Mk = this.transpose();
    let Ek = this.identity();

    let Mk_one = Mk.norm1_3x3();
    let Mk_inf = Mk.normInf_3x3();

    let MkAdjT,
        MkAdjT_one,
        MkAdjT_inf,
        Ek_one,
        Mk_det;
        
    do {
        // compute transpose of adjoint
        MkAdjT = Mk.adjointT_3x3();

        // Mk_det = det(Mk) -- computed from the adjoint
        Mk_det = Mk.data[0] * MkAdjT.data[0] +
            Mk.data[1] * MkAdjT.data[1] +
            Mk.data[2] * MkAdjT.data[2];

        // TODO: should this be a close to zero test ?
        if ( Mk_det == 0.0 ) {
            console.warn( "polarDecompose: Mk_det == 0.0" );
            break;
        }

        MkAdjT_one = MkAdjT.norm1_3x3();
        MkAdjT_inf = MkAdjT.normInf_3x3();

        // compute update factors
        const gamma = Math.sqrt( Math.sqrt( ( MkAdjT_one * MkAdjT_inf ) /
            ( Mk_one * Mk_inf ) ) / Math.abs( Mk_det ) );

        const g1 = 0.5 * gamma;
        const g2 = 0.5 / ( gamma * Mk_det );

        Ek.data = Mk.data.slice(0);
        
        Mk = Mk.multiply( g1 );          // this does:
        Mk = Mk.addScaled( MkAdjT, g2 ); // Mk = g1 * Mk + g2 * MkAdjT
        Ek = Ek.addScaled( Mk, -1.0 );   // Ek -= Mk;

        Ek_one = Ek.norm1_3x3();
        Mk_one = Mk.norm1_3x3();
        Mk_inf = Mk.normInf_3x3();
    } while ( Ek_one > ( Mk_one * TOL ) );

    const Q = Mk.transpose(); Q.data[15] = 1;
    const S = Mk.matmul( this ); S.data[15] = 1;
    const sData = S.data;
    for ( let i = 0; i < 3; ++i ) {
      for ( let j = i; j < 3; ++j ) {
        const k_ij = 4*i+j;
        const k_ji = 4*j+i;
        sData[k_ji] = sData[k_ij] = 0.5 * ( sData[k_ji] + sData[k_ij] );
      }
    }
    return [Q, S, Mk_det];
};

/**
 * Performs a spectral decomposition of this matrix.
 *
 * @param {x3dom.fields.SFMatrix4f} SO - resulting matrix
 * @param {x3dom.fields.SFVec3f} k - resulting vector
 */
SFMatrix4f.prototype.spectralDecompose = function ()
{
  const data = this.data;
  const next = [ 1, 2, 0 ];
  const maxIterations = 20;
  const diag = [ data[0], data[5], data[10] ]; // [ this._00, this._11, this._22 ];
  const offDiag = [ data[6], data[8], data[1] ]; // [ this._12, this._20, this._01 ];
  const SO = this.identity();
  
  for ( let iter = 0; iter < maxIterations; ++iter ) {
    const sm = Math.abs( offDiag[ 0 ] )
             + Math.abs( offDiag[ 1 ] )
             + Math.abs( offDiag[ 2 ] );
    if ( sm == 0 ) {
      break;
    }

    for ( let i = 2; i >= 0; --i )
    {
      const p = next[ i ];
      const q = next[ p ];

      const absOffDiag = Math.abs( offDiag[ i ] );
      const g = 100.0 * absOffDiag;

      if ( absOffDiag > 0.0 ) {
        let t = 0;
        const h = diag[ q ] - diag[ p ];
        const absh = Math.abs( h );

        if ( absh + g == absh ) {
          t = offDiag[ i ] / h;
        } else {
          const theta = 0.5 * h / offDiag[ i ];
          t =   1.0 / ( Math.abs( theta ) + Math.sqrt( theta*theta + 1.0 ) );
          t = theta < 0.0 ? -t : t;
        }

        const c = 1.0 / Math.sqrt( t * t + 1.0 );
        const s = t * c;

        const tau = s / ( c + 1.0 );
        const ta = t * offDiag[ i ];

        offDiag[ i ] = 0.0;

        diag[ p ] -= ta;
        diag[ q ] += ta;

        const offDiagq = offDiag[ q ];
        offDiag[ q ] -= s * ( offDiag[ p ] + tau * offDiagq );
        offDiag[ p ] += s * ( offDiagq - tau * offDiag[ p ] );

        for ( let j = 2; j >= 0; --j ) {
          const a = SO.data[4*j+p];
          const b = SO.data[4*j+q];
          SO.data[4*j+p] -= s * ( b + tau * a );
          SO.data[4*j+q] += s * ( a - tau * b );
        }
      }
    }
  }
  return [ SO, diag ];
};

/**
 * Taken from the x3dom.js library, who took it from
 * https://github.com/openscenegraph/OpenSceneGraph/blob/master/src/osg/MatrixDecomposition.cpp
 * 
 * Computes the decomposition of the given 4x4 affine matrix M as
 * M = T F R SO S SO^t, where T is a translation matrix,
 * F is +/- I (a reflection), R is a rotation matrix,
 * SO is a rotation matrix and S is a (nonuniform) scale matrix.
 *
 * @param {SFVec3f} t     -
 *          3D vector to be filled with the translation values
 * @param {Quaternion} r  -
 *          quaternion to be filled with the rotation values
 * @param {SFVec3f} s     -
 *          3D vector to be filled with the scale factors
 * @param {Quaternion} so -
 *          rotation (quaternion) to be applied before scaling
 * @returns {Number} signum of determinant of the transposed adjoint
 *                   upper 3x3 matrix
 */
SFMatrix4f.prototype.decompose = function ()
{
  const A = new SFMatrix4f( this.data.slice(0) ); // copy
  const aData = A.data;

  const t = [ aData[3], aData[7], aData[11] ];

  aData[3] = 0.0; // 03
  aData[7] = 0.0; // 13
  aData[11] = 0.0; // 23
  aData[12] = 0.0; // 30
  aData[13] = 0.0; // 31
  aData[14] = 0.0; // 32

  let [Q, S, det] = A.polarDecompose();
  let f = 1.0;
  if ( det < 0.0 ) {
    Q = Q.multiply(-1.0);
    f = -1.0;
  }

  const r = (new Quaternion()).fromSFMatrix4f( Q );
  const [SO,s] = S.spectralDecompose();
  const so = (new Quaternion()).fromSFMatrix4f( SO );
  return [t,f,r,s,so]
};

/**
 * Computes a determinant for a 3x3 matrix m, given as values in
 * row major order.
 *
 * @param {Number} a1 - value of m at (0,0)
 * @param {Number} a2 - value of m at (0,1)
 * @param {Number} a3 - value of m at (0,2)
 * @param {Number} b1 - value of m at (1,0)
 * @param {Number} b2 - value of m at (1,1)
 * @param {Number} b3 - value of m at (1,2)
 * @param {Number} c1 - value of m at (2,0)
 * @param {Number} c2 - value of m at (2,1)
 * @param {Number} c3 - value of m at (2,2)
 * @returns {Number} determinant
 */
SFMatrix4f.prototype.det3 = function ( a1,a2,a3,b1,b2,b3,c1,c2,c3 ) {
    return ( a1*b2*c3 ) + ( a2*b3*c1 ) + ( a3*b1*c2 ) - ( a1*b3*c2 ) - ( a2*b1*c3 ) - ( a3*b2*c1 );
};

/**
 * Computes the determinant of this matrix.
 *
 * @returns {Number} determinant
 */
SFMatrix4f.prototype.det = function () {
  const [a1,a2,a3,a4,b1,b2,b3,b4,c1,c2,c3,c4,d1,d2,d3,d4] = this.data;
  return ( a1 * this.det3( b2, b3, b4, c2, c3, c4, d2, d3, d4 ) -
           b1 * this.det3( a2, a3, a4, c2, c3, c4, d2, d3, d4 ) +
           c1 * this.det3( a2, a3, a4, b2, b3, b4, d2, d3, d4 ) -
           d1 * this.det3( a2, a3, a4, b2, b3, b4, c2, c3, c4 ) );
}

/**
 * Computes the inverse of this matrix, given that it is not singular.
 *
 * @returns {SFMatrix4f} the inverse of this matrix
 */
SFMatrix4f.prototype.inverse = function ()
{
  const [a1,a2,a3,a4,b1,b2,b3,b4,c1,c2,c3,c4,d1,d2,d3,d4] = this.data;
  let rDet = this.det();
  if ( rDet == 0 ) {
    console.warn( "Invert matrix: singular matrix, no inverse!" );
    return this.identity();
  }
  rDet = 1.0 / rDet;
  return new SFMatrix4f( new Float64Array([
      +this.det3( b2, b3, b4, c2, c3, c4, d2, d3, d4 ) * rDet,
      -this.det3( a2, a3, a4, c2, c3, c4, d2, d3, d4 ) * rDet,
      +this.det3( a2, a3, a4, b2, b3, b4, d2, d3, d4 ) * rDet,
      -this.det3( a2, a3, a4, b2, b3, b4, c2, c3, c4 ) * rDet,
      -this.det3( b1, b3, b4, c1, c3, c4, d1, d3, d4 ) * rDet,
      +this.det3( a1, a3, a4, c1, c3, c4, d1, d3, d4 ) * rDet,
      -this.det3( a1, a3, a4, b1, b3, b4, d1, d3, d4 ) * rDet,
      +this.det3( a1, a3, a4, b1, b3, b4, c1, c3, c4 ) * rDet,
      +this.det3( b1, b2, b4, c1, c2, c4, d1, d2, d4 ) * rDet,
      -this.det3( a1, a2, a4, c1, c2, c4, d1, d2, d4 ) * rDet,
      +this.det3( a1, a2, a4, b1, b2, b4, d1, d2, d4 ) * rDet,
      -this.det3( a1, a2, a4, b1, b2, b4, c1, c2, c4 ) * rDet,
      -this.det3( b1, b2, b3, c1, c2, c3, d1, d2, d3 ) * rDet,
      +this.det3( a1, a2, a3, c1, c2, c3, d1, d2, d3 ) * rDet,
      -this.det3( a1, a2, a3, b1, b2, b3, d1, d2, d3 ) * rDet,
      +this.det3( a1, a2, a3, b1, b2, b3, c1, c2, c3 ) * rDet
  ]) );
};

function composeTransform(orientation,spacing,anchorCoord,A_remaining,voxelAlignment) {
  const ras2ax = { L:0,R:0,P:1,A:1,I:2,S:2 }
  const ras2sign = { L:-1,R:1,P:-1,A:1,I:-1,S:1 }
  if (voxelAlignment && voxelAlignment === 'corner') {
    anchorCoord = [anchorCoord[0]-0.5,anchorCoord[1]-0.5,anchorCoord[2]-0.5];
  }
  let A_basic = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,1]];
  // orientation to RAS transform
  for (let i=0; i<3; i++) {
    const code = orientation[i];
    A_basic[ ras2ax[code] ][ i ] = ras2sign[code]*spacing[i];
  }
  A_basic = (new SFMatrix4f()).fromMatrix(A_basic);
  // Compute the real-world coordinate that the anchorCoord maps to
  const Ak = A_basic.multMatrixVec(anchorCoord);
  // Add offset such that anchorCoord maps to real-world coordinate (0,0,0)
  A_basic.data[3] = -Ak[0];
  A_basic.data[7] = -Ak[1];
  A_basic.data[11] = -Ak[2];
  return A_remaining ? A_basic.matmul(A_remaining) : A_basic;
}

export function decomposeTransform(A) {
  let [T,flip,R,S,SO] = A.decompose();
  // if (flip !== 1) S = S.multiply(flip);
  const RR = (flip === -1) ? R.toSFMatrix4f().multiply(-1) : R.toSFMatrix4f();
  const orientation = Array(3);
  for (let c=0; c<3; c++) {
    let mx = 0;
    let rMax = 0;
    for (let r=0; r<3; r++) { 
      let v = Math.abs(RR.data[4*r+c]);
      if (v>mx) { mx=v; rMax = r; }
    }
    orientation[c] = 'LRPAIS'.charAt(2*rMax+(RR.data[4*rMax+c]<0 ? 0 : 1));
  }
  const spacing = S; //flip ? [-S.x,-S.y,-S.z] : [S.x,S.y,S.z];
  
  // anchorCoord is the point in source space that points to 0,0,0 in target space
  const anchorCoord = A.inverse().multMatrixVec([ -T[0],-T[1],-T[2] ]);
  const A_toRas = composeTransform(orientation,spacing,anchorCoord);
  let A_remaining = A_toRas.inverse().matmul(A);
  return [orientation,spacing,anchorCoord,A_remaining];  
}

// VOLUMEREADER CLASS
export function volumeReader_class() {
}

volumeReader_class.prototype = {
  nrrdImageParser: async function(contents,metaOverride, progressBar) {
    const nrrd = await import('./nrrd.es6.js');
    await (progressBar || console).log('Parsing NRRD header...');
    
    function data2array(chunksOrBuffer,byteOffset,type) {
      const typeConversions = {
        'int8': Int8Array,
        'uint8': Uint8Array,
        'int16': Int16Array,
        'uint16': Uint16Array,
        'int32': Int32Array,
        'uint32': Uint32Array,
        'float': Float32Array,
        'double': Float64Array
      }
      const dataType = typeConversions[type.toLowerCase()];
      if (!dataType) runtimeError('nrrdImageReader: unsupported data type "'+type+'"',true);
      return chunksOrBuffer instanceof chunkedArray_class ? chunksOrBuffer.retype(dataType,byteOffset) : new (dataType)(chunksOrBuffer,byteOffset);
    }
    
    const header = nrrd.parseHeader(contents);

    const dims = header.sizes;
    let A = [[1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]];
    if (header.spaceDirections) {
      for (let i=0; i<3; i++) {
        const dir = header.spaceDirections[i];
        A[0][i] = dir[0]; A[1][i] = dir[1]; A[2][i] = dir[2];
      }
    }
    if (header.spaceOrigin) {
      const b = header.spaceOrigin;
      A[0][3] = b[0]; A[1][3] = b[1]; A[2][3] = b[2];
    }
    A = (new SFMatrix4f()).fromMatrix(A);
    let [orientation,spacing,anchorCoord,A_remaining] = decomposeTransform(A);
    
    if (header.space) {
      // override assumption that real-world orientation is RAS
      let space = header.space.toLowerCase();
      const parts = space.split('-');
      if (parts.length==3) {
        const orientationCode = {'left':'L','right':'R','inferior':'I','superior':'S','anterior':'A','posterior':'P'};
        space = parts.map( (s)=>orientationCode[s] ).join('');
      }
      if (space.length == 3) {
        space = space.toUpperCase();
        const ras2ax = { L:0,R:0,P:1,A:1,I:2,S:2 }
        const axes = new Set( Array.from(space).map( (s)=>ras2ax[s] ) );
        if (axes.has(0) && axes.has(1) && axes.has(2)) {
          orientation = space;
        } else {
          console.warn('Could not parse NRRD space attribute '+header.space)
        }
      }
    }
    await (progressBar || console).log('Parsing NRRD header; image size ['+dims.join('x')+']',true);
    let imgArray;
    if ('dataFile' in header) {
      runtimeError('nrrdImageReader: No support for data in separate file.');
    } else {
      let encoding = header.encoding;
      let byteOffset = header.byteOffset;
      if (encoding === 'gzip') {
        await (progressBar || console).log('Unzipping NRRD data...');
        contents = new chunkedArray_class( inflate(new Uint8Array(contents,header.byteOffset),{keepChunks:true}) )
        encoding = 'raw';
        byteOffset = 0;
      }
      if (encoding === 'raw') {
        await (progressBar || console).log('Parsing NRRD binary data...');
        imgArray = data2array(contents,byteOffset,header.type);
      } else if (encoding === 'ascii') {
        await (progressBar || console).log('Parsing NRRD text data...');
        imgArray = nrrd.parseNRRDTextData(contents, header.type, dims);
      } else {
        console.error('nrrdImageReader: Unsupported encoding "'+encoding+'"',true);
      }
    }
    
    const numChannels = 1;
    const memoryLayout = 'F';
    const byteOrder = header.endian && header.endian.toLowerCase() === 'big' ? 'B' : 'L';
    const ndArray = new ndArray_class(imgArray,numChannels,dims,memoryLayout,byteOrder);
    await (progressBar || console).log('Ready.');
    
    return [ndArray,A];
  }
}
