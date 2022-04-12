'use strict';

/**
 * Module dependencies
 */

/* eslint-disable no-unused-vars */
// Public node modules.
const _ = require('lodash');
const AWS = require('aws-sdk');
const crypto = require('crypto')


class FileLocationConverter {
    static getKey(config, file) {
      return `${config.directory ? `${config.directory}/` : ''}${file.hash}${file.ext}`
    }
  
    static getUrl(config, data) {
      let url = data.Location
  
      if (config.cdn) {
        const domainUrl = new URL(`https://${config.cdn}`)
        domainUrl.pathname += `/${data.Key || data.key}`
        url = domainUrl.href
      } else {
        const domainUrl = new URL(`/${config.bucket}/${data.Key || data.key}`, `https://${config.domain}`)
        url = domainUrl.href
      }
  
      return url
    }
  }

module.exports = {

  init(config) {
    const s3 = new AWS.S3({
     accessKeyId: config.key,
     secretAccessKey: config.secret,
     endpoint: config.endpoint || 'https://s3.timeweb.com',
     s3ForcePathStyle: true,
     region: config.region || 'ru-1',
     apiVersion: 'latest',
    });
    

    const upload = (file, customParams = {}) =>
      new Promise((resolve, reject) => {
        file.hash = crypto.createHash('md5').update(file.hash).digest('hex')
        // const path = file.path ? `${file.path}/` : '';
        s3.upload({
          Bucket: config.bucket,
          // Key: `${path}${file.hash}${file.ext}`,
          Key: FileLocationConverter.getKey(config, file),
          Body: file.stream || Buffer.from(file.buffer, 'binary'),
          ContentType: file.mime,
          ...customParams,
        }, (err, data) => {
          if (err) return reject(err)
          file.url = FileLocationConverter.getUrl(config, data)
          resolve()
        })
        
      });

    return {
      uploadStream(file, customParams = {}) {
        return upload(file, customParams);
      },
      upload(file, customParams = {}) {
        return upload(file, customParams);
      },
      delete(file, customParams = {}) {
        return new Promise((resolve, reject) => {
            s3.deleteObject({
                Bucket: config.bucket,
                Key: FileLocationConverter.getKey(config, file),
              }, (err, data) => {
                if (err) {
                  return reject(err)
                }
    
                resolve()
              })
        });
      },
    };
  },
};