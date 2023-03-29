"use strict"

// CLASS IMAGESTACK
export function imageStack_class() {
  this.slices = [];
  this.transformations = {};
}

imageStack_class.prototype = {
  imageTypes: {
    'gif':'image/gif',
    'png':'image/png',
    'jpg':'image/jpeg',
    'jpeg':'image/jpeg',
    'tif':'image/tiff',
    'tiff':'image/tiff'
  },
  vectorTypes: {
    'plotly':'application/plotly',
    'json':'application/hbp.movi+json',
    'xml':'model/mbf.xml',
    'asc':'model/mbf.asc',
    'dat':'model/mbf.dat'
  },
  init: async function(dataSource) {
    let zipFile = false;
    try {
      const firstFile = dataSource[0];
      if (firstFile.name.split('.').pop() === 'zip') zipFile = firstFile;
    } catch(error) {}
    if (zipFile) {
      await this.populateFromZip(zipFile);
    } else try {
      this.populateFromUrls(dataSource);
    } catch(error) { console.error(error); }
  },
  populateSlices(names,allowedMediaTypes, slices,layerIndex) {
    // determine a common file naming pattern
    const re = /\d+(?:\.\d+)?/;
    const keyCounts = {};
    const name2type = {}
    for (let name of names) {
      const ext = name.split('.').pop();
      if (ext in allowedMediaTypes) {
        name2type[name] = allowedMediaTypes[ext];
        const key = name.split(re).join('$#$');
        if (!keyCounts.hasOwnProperty(key)) keyCounts[key] = 0
        keyCounts[key] += 1;
      }
    }
    let commonKey = [undefined,0];
    for (let [key,count] of Object.entries(keyCounts)) {
      if (count>commonKey[1]) commonKey = [key,count]
    }
    // retain only names that fit the common pattern
    const commonNames = [];
    for (const name of Object.keys(name2type)) {
      const key = name.split(re).join('$#$');
      if (key == commonKey[0]) {
        commonNames.push(name);
      }
    }
    // find number-slots in the naming pattern and count unique occurrences
    if (commonKey[0] === undefined) {
      console.log('No common key found.')
      return;
    }
    const numSlots = commonKey[0].split('$#$').length-1;
    const uniqueValues = Array.from(Array(numSlots),()=>new Set());
    for (let name of commonNames) {
      const matches = [...name.matchAll(/\d+(?:\.\d+)?/g)];
      for (let [i,m] of matches.entries()) {
        uniqueValues[i].add(parseFloat(m[0]))
      }
    }
    // select the last number slot with all-unique values
    let slot = -1;
    for (let [i,v] of uniqueValues.entries()) {
      if (v.size === commonKey[1]) slot = i;
    }
    const nameByPositionIndex = {};
    if (slot === -1) {
      console.log('No position index found.')
      return;
    }
    for (let name of commonNames) {
      const matches = [...name.matchAll(/\d+(?:\.\d+)?/g)];
      //const positionIndex = parseFloat(matches[slot][0]);
      nameByPositionIndex[matches[slot][0]] = name;
    }
    for (let [positionIndex,name] of Object.entries(nameByPositionIndex)) {
      if (!slices.hasOwnProperty(positionIndex)) {
        slices[positionIndex] = {
          name: name,
          positionIndex: parseFloat(positionIndex),
          layers: []
        }
      }        
      slices[positionIndex].layers[layerIndex] = {
        name,
        mediaType: name2type[name]
      };
    }
  },
  metaFromNames: function(names) {
    const slices = {};
    this.populateSlices(names,this.imageTypes,slices,0);
    this.populateSlices(names,this.vectorTypes,slices,1);
    return {
      'slices':Object.values(slices)
    }
  },
  populateFromZip: async function(zipfile) {
    let {unzip} = await import('./unzipit.js');
    const {entries} = await unzip(zipfile);
    // find index.json file
    let metaData = undefined
    for (const name in entries) {
      if (name === 'index.json') {
        metaData = await entry.json();
        break;
      }
      const ext = name.split('.').pop();
      if (ext == 'json') {
        const test = await entry.json('application/json');
        if (test['@type'].toLowerCase().endsWith('imagestack')) {
          metaData = test;
        }
      }
    }
    if (!metaData) metaData = this.metaFromNames(Object.keys(entries));
    for (let slice of metaData.slices) {
      for (let layer of slice.layers) {
        if (layer) layer.source = entries[layer.name];
      }
    }
    // sort the stack by position index
    this.slices = metaData.slices.sort((a, b)=>(a.positionIndex>b.positionIndex));
    this.transformations = [];    
  },
  populateFromUrls: async function(files) {
    let metaData = this.metaFromNames(files);
    for (let slice of metaData.slices) {
      for (let layer of slice.layers) {
        layer.source = layer.name;
      }
    }    
    // sort the stack by position index
    this.slices = metaData.slices.sort((a, b)=>(a.positionIndex>b.positionIndex));
    this.transformations = [];
  }
}
