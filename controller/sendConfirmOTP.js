const nodemailer = require('nodemailer');

const verifyOTP = require('../model/verifyOTP');

const TimeStamp = require('./TimeStamp');


// let { defaultProvider } = require("@aws-sdk/credential-provider-node");

// const ses = new aws.SES({
//   apiVersion: "2010-12-01",
//   region: "us-east-1",
//   defaultProvider,
// });

// // create Nodemailer SES transporter
// let transporter = nodemailer.createTransport({
//   SES: { ses, aws },
// });


// create Nodemailer SES transporter
// let transporter = nodemailer.createTransport({
//   SES: new AWS.SES({
//     apiVersion: '2010-12-01'
//   })
// });

var transport = nodemailer.createTransport({
  host: process.env.HOST_EMAIL,
  port: process.env.EMAIL_SMTP_PORT,
  auth: {
    user: process.env.EMAIL_SMTP_AUTH_USER,
    pass: process.env.EMAIL_SMTP_AUTH_PASSWORD
  }
});

const sendconfirmOTP = (req, reqEmail) => {

  const OTP = Math.floor(100000 + Math.random() * 900000);
  /* parseInt(Math.random() * 10000);  */
  console.log(OTP);

  var message = {
    from: 'noreply@drustii.in',
    to: reqEmail,
    subject: 'Confirm Email',
    text: 'Please confirm your email',
    html: `        
        <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html
          xmlns="http://www.w3.org/1999/xhtml"
          xmlns:v="urn:schemas-microsoft-com:vml"
          xmlns:o="urn:schemas-microsoft-com:office:office"
        >
          <head>
            <!--[if gte mso 9]>
              <xml>
                <o:OfficeDocumentSettings>
                  <o:AllowPNG />
                  <o:PixelsPerInch>96</o:PixelsPerInch>
                </o:OfficeDocumentSettings>
              </xml>
            <![endif]-->
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta name="x-apple-disable-message-reformatting" />
            <!--[if !mso]><!-->
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <!--<![endif]-->
            <title></title>
        
            <style type="text/css">
              @media only screen and (min-width: 620px) {
                .u-row {
                  width: 600px !important;
                }
                .u-row .u-col {
                  vertical-align: top;
                }
        
                .u-row .u-col-18 {
                  width: 108px !important;
                }
        
                .u-row .u-col-18p34 {
                  width: 110.04px !important;
                }
        
                .u-row .u-col-63p66 {
                  width: 381.96px !important;
                }
        
                .u-row .u-col-100 {
                  width: 600px !important;
                }
              }
        
              @media (max-width: 620px) {
                .u-row-container {
                  max-width: 100% !important;
                  padding-left: 0px !important;
                  padding-right: 0px !important;
                }
                .u-row .u-col {
                  min-width: 320px !important;
                  max-width: 100% !important;
                  display: block !important;
                }
                .u-row {
                  width: calc(100% - 40px) !important;
                }
                .u-col {
                  width: 100% !important;
                }
                .u-col > div {
                  margin: 0 auto;
                }
              }
              body {
                margin: 0;
                padding: 0;
              }
        
              table,
              tr,
              td {
                vertical-align: top;
                border-collapse: collapse;
              }
        
              p {
                margin: 0;
              }
        
              .ie-container table,
              .mso-container table {
                table-layout: fixed;
              }
        
              * {
                line-height: inherit;
              }
        
              a[x-apple-data-detectors="true"] {
                color: inherit !important;
                text-decoration: none !important;
              }
        
              table,
              td {
                color: #000000;
              }
              @media (max-width: 480px) {
                #u_content_image_3 .v-container-padding-padding {
                  padding: 46px 10px 10px !important;
                }
                #u_content_image_3 .v-src-width {
                  width: auto !important;
                }
                #u_content_image_3 .v-src-max-width {
                  max-width: 29% !important;
                }
                #u_content_heading_3 .v-container-padding-padding {
                  padding: 10px 20px !important;
                }
                #u_content_heading_3 .v-font-size {
                  font-size: 28px !important;
                }
                #u_content_text_3 .v-container-padding-padding {
                  padding: 10px 22px 26px !important;
                }
              }
            </style>
        
            <!--[if !mso]><!-->
            <link
              href="https://fonts.googleapis.com/css?family=Montserrat:400,700&display=swap"
              rel="stylesheet"
              type="text/css"
            />
            <!--<![endif]-->
          </head>
        
          <body
            class="clean-body u_body"
            style="
              margin: 0;
              padding: 0;
              -webkit-text-size-adjust: 100%;
              background-color: #e3e3e7;
              color: #000000;
            "
          >
            <!--[if IE]><div class="ie-container"><![endif]-->
            <!--[if mso]><div class="mso-container"><![endif]-->
            <table
              style="
                border-collapse: collapse;
                table-layout: fixed;
                border-spacing: 0;
                mso-table-lspace: 0pt;
                mso-table-rspace: 0pt;
                vertical-align: top;
                min-width: 320px;
                margin: 0 auto;
                background-color: #e3e3e7;
                width: 100%;
              "
              cellpadding="0"
              cellspacing="0"
            >
              <tbody>
                <tr style="vertical-align: top">
                  <td
                    style="
                      word-break: break-word;
                      border-collapse: collapse !important;
                      vertical-align: top;
                    "
                  >
                    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color: #e3e3e7;"><![endif]-->
        
                    <div
                      class="u-row-container"
                      style="padding: 0px; background-color: transparent"
                    >
                      <div
                        class="u-row"
                        style="
                          margin: 0 auto;
                          min-width: 320px;
                          max-width: 600px;
                          overflow-wrap: break-word;
                          word-wrap: break-word;
                          word-break: break-word;
                          background-color: #111114;
                        "
                      >
                        <div
                          style="
                            border-collapse: collapse;
                            display: table;
                            width: 100%;
                            background-color: transparent;
                          "
                        >
                          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #111114;"><![endif]-->
        
                          <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                          <div
                            class="u-col u-col-100"
                            style="
                              max-width: 320px;
                              min-width: 600px;
                              display: table-cell;
                              vertical-align: top;
                            "
                          >
                            <div
                              style="
                                width: 100% !important;
                                border-radius: 0px;
                                -webkit-border-radius: 0px;
                                -moz-border-radius: 0px;
                              "
                            >
                              <!--[if (!mso)&(!IE)]><!--><div
                                style="
                                  padding: 0px;
                                  border-top: 0px solid transparent;
                                  border-left: 0px solid transparent;
                                  border-right: 0px solid transparent;
                                  border-bottom: 0px solid transparent;
                                  border-radius: 0px;
                                  -webkit-border-radius: 0px;
                                  -moz-border-radius: 0px;
                                "
                              ><!--<![endif]-->
                                <table
                                  style="font-family: 'Montserrat', sans-serif"
                                  role="presentation"
                                  cellpadding="0"
                                  cellspacing="0"
                                  width="100%"
                                  border="0"
                                >
                                  <tbody>
                                    <tr>
                                      <td
                                        class="v-container-padding-padding"
                                        style="
                                          overflow-wrap: break-word;
                                          word-break: break-word;
                                          padding: 15px;
                                          font-family: 'Montserrat', sans-serif;
                                        "
                                        align="left"
                                      >
                                        <h1
                                          class="v-font-size"
                                          style="
                                            margin: 0px;
                                            color: #f5f5f5;
                                            line-height: 140%;
                                            text-align: center;
                                            word-wrap: break-word;
                                            font-weight: normal;
                                            font-family: comic sans ms, sans-serif;
                                            font-size: 26px;
                                          "
                                        >
                                          <strong>Drustii</strong>
                                        </h1>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
        
                                <!--[if (!mso)&(!IE)]><!-->
                              </div>
                              <!--<![endif]-->
                            </div>
                          </div>
                          <!--[if (mso)|(IE)]></td><![endif]-->
                          <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                        </div>
                      </div>
                    </div>
        
                    <div
                      class="u-row-container"
                      style="padding: 0px; background-color: transparent"
                    >
                      <div
                        class="u-row"
                        style="
                          margin: 0 auto;
                          min-width: 320px;
                          max-width: 600px;
                          overflow-wrap: break-word;
                          word-wrap: break-word;
                          word-break: break-word;
                          background-color: transparent;
                        "
                      >
                        <div
                          style="
                            border-collapse: collapse;
                            display: table;
                            width: 100%;
                            background-color: transparent;
                          "
                        >
                          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]-->
        
                          <!--[if (mso)|(IE)]><td align="center" width="600" style="background-color: #fffefe;width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                          <div
                            class="u-col u-col-100"
                            style="
                              max-width: 320px;
                              min-width: 600px;
                              display: table-cell;
                              vertical-align: top;
                            "
                          >
                            <div
                              style="
                                background-color: #fffefe;
                                width: 100% !important;
                                border-radius: 0px;
                                -webkit-border-radius: 0px;
                                -moz-border-radius: 0px;
                              "
                            >
                              <!--[if (!mso)&(!IE)]><!--><div
                                style="
                                  padding: 0px;
                                  border-top: 0px solid transparent;
                                  border-left: 0px solid transparent;
                                  border-right: 0px solid transparent;
                                  border-bottom: 0px solid transparent;
                                  border-radius: 0px;
                                  -webkit-border-radius: 0px;
                                  -moz-border-radius: 0px;
                                "
                              ><!--<![endif]-->
                                <table
                                  id="u_content_image_3"
                                  style="font-family: 'Montserrat', sans-serif"
                                  role="presentation"
                                  cellpadding="0"
                                  cellspacing="0"
                                  width="100%"
                                  border="0"
                                >
                                  <tbody>
                                    <tr>
                                      <td
                                        class="v-container-padding-padding"
                                        style="
                                          overflow-wrap: break-word;
                                          word-break: break-word;
                                          padding: 55px 10px 10px;
                                          font-family: 'Montserrat', sans-serif;
                                        "
                                        align="left"
                                      >
                                        <table
                                          width="100%"
                                          cellpadding="0"
                                          cellspacing="0"
                                          border="0"
                                        >
                                          <tr>
                                            <td
                                              style="
                                                padding-right: 0px;
                                                padding-left: 0px;
                                              "
                                              align="center"
                                            >
                                              <img
                                                align="center"
                                                border="0"
                                                src="https://drustii.s3.ap-south-1.amazonaws.com/public/image-1.png"
                                                alt="Tick Icon"
                                                title="Tick Icon"
                                                style="
                                                  outline: none;
                                                  text-decoration: none;
                                                  -ms-interpolation-mode: bicubic;
                                                  clear: both;
                                                  display: inline-block !important;
                                                  border: none;
                                                  height: auto;
                                                  float: none;
                                                  width: 14%;
                                                  max-width: 81.2px;
                                                "
                                                width="81.2"
                                                class="v-src-width v-src-max-width"
                                              />
                                            </td>
                                          </tr>
                                        </table>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
        
                                <table
                                  id="u_content_heading_3"
                                  style="font-family: 'Montserrat', sans-serif"
                                  role="presentation"
                                  cellpadding="0"
                                  cellspacing="0"
                                  width="100%"
                                  border="0"
                                >
                                  <tbody>
                                    <tr>
                                      <td
                                        class="v-container-padding-padding"
                                        style="
                                          overflow-wrap: break-word;
                                          word-break: break-word;
                                          padding: 10px 55px;
                                          font-family: 'Montserrat', sans-serif;
                                        "
                                        align="left"
                                      >
                                        <h1
                                          class="v-font-size"
                                          style="
                                            margin: 0px;
                                            line-height: 160%;
                                            text-align: center;
                                            word-wrap: break-word;
                                            font-weight: normal;
                                            font-family: 'Montserrat', sans-serif;
                                            font-size: 33px;
                                          "
                                        >
                                          <strong
                                            >Email Confirmation to Activate
                                            Account</strong
                                          >
                                        </h1>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
        
                                <table
                                  id="u_content_text_3"
                                  style="font-family: 'Montserrat', sans-serif"
                                  role="presentation"
                                  cellpadding="0"
                                  cellspacing="0"
                                  width="100%"
                                  border="0"
                                >
                                  <tbody>
                                    <tr>
                                      <td
                                        class="v-container-padding-padding"
                                        style="
                                          overflow-wrap: break-word;
                                          word-break: break-word;
                                          padding: 10px 60px 20px;
                                          font-family: 'Montserrat', sans-serif;
                                        "
                                        align="left"
                                      >
                                        <div
                                          style="
                                            color: #444444;
                                            line-height: 170%;
                                            text-align: center;
                                            word-wrap: break-word;
                                          "
                                        >
                                          <p style="font-size: 14px; line-height: 170%">
                                            Please confirm your email , to activate your
                                            account
                                          </p>
                                        </div>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
        
                                <table
                                  style="font-family: 'Montserrat', sans-serif"
                                  role="presentation"
                                  cellpadding="0"
                                  cellspacing="0"
                                  width="100%"
                                  border="0"
                                >
                                  <tbody>
                                    <tr>
                                      <td
                                        class="v-container-padding-padding"
                                        style="
                                          overflow-wrap: break-word;
                                          word-break: break-word;
                                          padding: 0px 60px;
                                          font-family: 'Montserrat', sans-serif;
                                        "
                                        align="left"
                                      >
                                        <div
                                          style="
                                            color: #444444;
                                            line-height: 200%;
                                            text-align: center;
                                            word-wrap: break-word;
                                          "
                                        >
                                          <p
                                            style="
                                              font-size: 14px;
                                              line-height: 200%;
                                              text-align: center;
                                            "
                                          >
                                            <span
                                              style="font-size: 16px; line-height: 32px"
                                              >Your OTP ${OTP} 
                                            </span>
                                            OTP is valid for 5 minutes only.
                                          </p>
                                        </div>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
        
                                <!--[if (!mso)&(!IE)]><!-->
                              </div>
                              <!--<![endif]-->
                            </div>
                          </div>
                          <!--[if (mso)|(IE)]></td><![endif]-->
                          <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                        </div>
                      </div>
                    </div>
        
                    <div
                      class="u-row-container"
                      style="padding: 8px; background-color: transparent"
                    >
                      <div
                        class="u-row"
                        style="
                          margin: 0 auto;
                          min-width: 320px;
                          max-width: 600px;
                          overflow-wrap: break-word;
                          word-wrap: break-word;
                          word-break: break-word;
                          background-color: #ffffff;
                        "
                      >
                        <div
                          style="
                            border-collapse: collapse;
                            display: table;
                            width: 100%;
                            background-color: transparent;
                          "
                        >
                          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 8px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #ffffff;"><![endif]-->
        
                          <!--[if (mso)|(IE)]><td align="center" width="108" style="width: 108px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                          <div
                            class="u-col u-col-18"
                            style="
                              max-width: 320px;
                              min-width: 108px;
                              display: table-cell;
                              vertical-align: top;
                            "
                          >
                            <div
                              style="
                                width: 100% !important;
                                border-radius: 0px;
                                -webkit-border-radius: 0px;
                                -moz-border-radius: 0px;
                              "
                            >
                              <!--[if (!mso)&(!IE)]><!--><div
                                style="
                                  padding: 0px;
                                  border-top: 0px solid transparent;
                                  border-left: 0px solid transparent;
                                  border-right: 0px solid transparent;
                                  border-bottom: 0px solid transparent;
                                  border-radius: 0px;
                                  -webkit-border-radius: 0px;
                                  -moz-border-radius: 0px;
                                "
                              ><!--<![endif]-->
                                <table
                                  style="font-family: 'Montserrat', sans-serif"
                                  role="presentation"
                                  cellpadding="0"
                                  cellspacing="0"
                                  width="100%"
                                  border="0"
                                >
                                  <tbody>
                                    <tr>
                                      <td
                                        class="v-container-padding-padding"
                                        style="
                                          overflow-wrap: break-word;
                                          word-break: break-word;
                                          padding: 10px;
                                          font-family: 'Montserrat', sans-serif;
                                        "
                                        align="left"
                                      >
                                        <table
                                          height="0px"
                                          align="center"
                                          border="0"
                                          cellpadding="0"
                                          cellspacing="0"
                                          width="100%"
                                          style="
                                            border-collapse: collapse;
                                            table-layout: fixed;
                                            border-spacing: 0;
                                            mso-table-lspace: 0pt;
                                            mso-table-rspace: 0pt;
                                            vertical-align: top;
                                            border-top: 0px solid #ffffff;
                                            -ms-text-size-adjust: 100%;
                                            -webkit-text-size-adjust: 100%;
                                          "
                                        >
                                          <tbody>
                                            <tr style="vertical-align: top">
                                              <td
                                                style="
                                                  word-break: break-word;
                                                  border-collapse: collapse !important;
                                                  vertical-align: top;
                                                  font-size: 0px;
                                                  line-height: 0px;
                                                  mso-line-height-rule: exactly;
                                                  -ms-text-size-adjust: 100%;
                                                  -webkit-text-size-adjust: 100%;
                                                "
                                              >
                                                <span>&#160;</span>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
        
                                <!--[if (!mso)&(!IE)]><!-->
                              </div>
                              <!--<![endif]-->
                            </div>
                          </div>
                          <!--[if (mso)|(IE)]></td><![endif]-->
                          <!--[if (mso)|(IE)]><td align="center" width="380" style="background-color: #cca250;width: 380px;padding: 20px;border-top: 1px solid #CCC;border-left: 1px solid #CCC;border-right: 1px solid #CCC;border-bottom: 1px solid #CCC;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                          <div
                            class="u-col u-col-63p66"
                            style="
                              max-width: 320px;
                              min-width: 382px;
                              display: table-cell;
                              vertical-align: top;
                            "
                          >
                            <div
                              style="
                                background-color: #cca250;
                                width: 100% !important;
                                border-radius: 0px;
                                -webkit-border-radius: 0px;
                                -moz-border-radius: 0px;
                              "
                            >
                              <!--[if (!mso)&(!IE)]><!--><div
                                style="
                                  padding: 20px;
                                  border-top: 1px solid #ccc;
                                  border-left: 1px solid #ccc;
                                  border-right: 1px solid #ccc;
                                  border-bottom: 1px solid #ccc;
                                  border-radius: 0px;
                                  -webkit-border-radius: 0px;
                                  -moz-border-radius: 0px;
                                "
                              ><!--<![endif]-->
                                <table
                                  style="font-family: 'Montserrat', sans-serif"
                                  role="presentation"
                                  cellpadding="0"
                                  cellspacing="0"
                                  width="100%"
                                  border="0"
                                >
                                  <tbody>
                                    <tr>
                                      <td
                                        class="v-container-padding-padding"
                                        style="
                                          overflow-wrap: break-word;
                                          word-break: break-word;
                                          padding: 0px;
                                          font-family: 'Montserrat', sans-serif;
                                        "
                                        align="left"
                                      >
                                        <h1
                                          class="v-font-size"
                                          style="
                                            margin: 0px;
                                            color: #ffffff;
                                            line-height: 160%;
                                            text-align: center;
                                            word-wrap: break-word;
                                            font-weight: normal;
                                            font-family: 'Montserrat', sans-serif;
                                            font-size: 20px;
                                          "
                                        >
                                          <strong>NOTICE<br /></strong>
                                        </h1>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
        
                                <table
                                  style="font-family: 'Montserrat', sans-serif"
                                  role="presentation"
                                  cellpadding="0"
                                  cellspacing="0"
                                  width="100%"
                                  border="0"
                                >
                                  <tbody>
                                    <tr>
                                      <td
                                        class="v-container-padding-padding"
                                        style="
                                          overflow-wrap: break-word;
                                          word-break: break-word;
                                          padding: 10px;
                                          font-family: 'Montserrat', sans-serif;
                                        "
                                        align="left"
                                      >
                                        <div
                                          style="
                                            color: #f1f8f5;
                                            line-height: 200%;
                                            text-align: left;
                                            word-wrap: break-word;
                                          "
                                        >
                                          <p style="font-size: 14px; line-height: 200%">
                                            <span
                                              style="
                                                color: #f7e1b5;
                                                font-size: 14px;
                                                line-height: 28px;
                                              "
                                              ><strong>✓</strong></span
                                            >
                                            &nbsp;Please Dont share OTP to anyone else.
                                          </p>
                                          <p style="font-size: 14px; line-height: 200%">
                                            ✓ &nbsp;If you are Not requested to activate
                                            account contact us.
                                          </p>
                                        </div>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
        
                                <!--[if (!mso)&(!IE)]><!-->
                              </div>
                              <!--<![endif]-->
                            </div>
                          </div>
                          <!--[if (mso)|(IE)]></td><![endif]-->
                          <!--[if (mso)|(IE)]><td align="center" width="110" style="width: 110px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                          <div
                            class="u-col u-col-18p34"
                            style="
                              max-width: 320px;
                              min-width: 110px;
                              display: table-cell;
                              vertical-align: top;
                            "
                          >
                            <div
                              style="
                                width: 100% !important;
                                border-radius: 0px;
                                -webkit-border-radius: 0px;
                                -moz-border-radius: 0px;
                              "
                            >
                              <!--[if (!mso)&(!IE)]><!--><div
                                style="
                                  padding: 0px;
                                  border-top: 0px solid transparent;
                                  border-left: 0px solid transparent;
                                  border-right: 0px solid transparent;
                                  border-bottom: 0px solid transparent;
                                  border-radius: 0px;
                                  -webkit-border-radius: 0px;
                                  -moz-border-radius: 0px;
                                "
                              ><!--<![endif]-->
                                <table
                                  style="font-family: 'Montserrat', sans-serif"
                                  role="presentation"
                                  cellpadding="0"
                                  cellspacing="0"
                                  width="100%"
                                  border="0"
                                >
                                  <tbody>
                                    <tr>
                                      <td
                                        class="v-container-padding-padding"
                                        style="
                                          overflow-wrap: break-word;
                                          word-break: break-word;
                                          padding: 10px;
                                          font-family: 'Montserrat', sans-serif;
                                        "
                                        align="left"
                                      >
                                        <table
                                          height="0px"
                                          align="center"
                                          border="0"
                                          cellpadding="0"
                                          cellspacing="0"
                                          width="100%"
                                          style="
                                            border-collapse: collapse;
                                            table-layout: fixed;
                                            border-spacing: 0;
                                            mso-table-lspace: 0pt;
                                            mso-table-rspace: 0pt;
                                            vertical-align: top;
                                            border-top: 0px solid #ffffff;
                                            -ms-text-size-adjust: 100%;
                                            -webkit-text-size-adjust: 100%;
                                          "
                                        >
                                          <tbody>
                                            <tr style="vertical-align: top">
                                              <td
                                                style="
                                                  word-break: break-word;
                                                  border-collapse: collapse !important;
                                                  vertical-align: top;
                                                  font-size: 0px;
                                                  line-height: 0px;
                                                  mso-line-height-rule: exactly;
                                                  -ms-text-size-adjust: 100%;
                                                  -webkit-text-size-adjust: 100%;
                                                "
                                              >
                                                <span>&#160;</span>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
        
                                <!--[if (!mso)&(!IE)]><!-->
                              </div>
                              <!--<![endif]-->
                            </div>
                          </div>
                          <!--[if (mso)|(IE)]></td><![endif]-->
                          <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                        </div>
                      </div>
                    </div>
        
                    <div
                      class="u-row-container"
                      style="padding: 0px; background-color: transparent"
                    >
                      <div
                        class="u-row"
                        style="
                          margin: 0 auto;
                          min-width: 320px;
                          max-width: 600px;
                          overflow-wrap: break-word;
                          word-wrap: break-word;
                          word-break: break-word;
                          background-color: #111114;
                        "
                      >
                        <div
                          style="
                            border-collapse: collapse;
                            display: table;
                            width: 100%;
                            background-color: transparent;
                          "
                        >
                          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #111114;"><![endif]-->
        
                          <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                          <div
                            class="u-col u-col-100"
                            style="
                              max-width: 320px;
                              min-width: 600px;
                              display: table-cell;
                              vertical-align: top;
                            "
                          >
                            <div
                              style="
                                width: 100% !important;
                                border-radius: 0px;
                                -webkit-border-radius: 0px;
                                -moz-border-radius: 0px;
                              "
                            >
                              <!--[if (!mso)&(!IE)]><!--><div
                                style="
                                  padding: 0px;
                                  border-top: 0px solid transparent;
                                  border-left: 0px solid transparent;
                                  border-right: 0px solid transparent;
                                  border-bottom: 0px solid transparent;
                                  border-radius: 0px;
                                  -webkit-border-radius: 0px;
                                  -moz-border-radius: 0px;
                                "
                              ><!--<![endif]-->
                                <table
                                  style="font-family: 'Montserrat', sans-serif"
                                  role="presentation"
                                  cellpadding="0"
                                  cellspacing="0"
                                  width="100%"
                                  border="0"
                                >
                                  <tbody>
                                    <tr>
                                      <td
                                        class="v-container-padding-padding"
                                        style="
                                          overflow-wrap: break-word;
                                          word-break: break-word;
                                          padding: 32px 10px 0px;
                                          font-family: 'Montserrat', sans-serif;
                                        "
                                        align="left"
                                      >
                                        <div
                                          style="
                                            color: #ffffff;
                                            line-height: 140%;
                                            text-align: center;
                                            word-wrap: break-word;
                                          "
                                        >
                                          <p style="font-size: 14px; line-height: 140%">
                                            <span
                                              style="
                                                font-size: 18px;
                                                line-height: 25.2px;
                                              "
                                              ><strong>Drustii</strong></span
                                            >
                                          </p>
                                        </div>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
        
                                <table
                                  style="font-family: 'Montserrat', sans-serif"
                                  role="presentation"
                                  cellpadding="0"
                                  cellspacing="0"
                                  width="100%"
                                  border="0"
                                >
                                  <tbody>
                                    <tr>
                                      <td
                                        class="v-container-padding-padding"
                                        style="
                                          overflow-wrap: break-word;
                                          word-break: break-word;
                                          padding: 10px;
                                          font-family: 'Montserrat', sans-serif;
                                        "
                                        align="left"
                                      >
                                        <div
                                          style="
                                            color: #b0b1b4;
                                            line-height: 180%;
                                            text-align: center;
                                            word-wrap: break-word;
                                          "
                                        >
                                          <p style="font-size: 14px; line-height: 180%">
                                            Near Government Polytechnic Ratnagiri,
                                            Ratnagiri
                                          </p>
                                        </div>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
        
                                <table
                                  style="font-family: 'Montserrat', sans-serif"
                                  role="presentation"
                                  cellpadding="0"
                                  cellspacing="0"
                                  width="100%"
                                  border="0"
                                >
                                  <tbody>
                                    <tr>
                                      <td
                                        class="v-container-padding-padding"
                                        style="
                                          overflow-wrap: break-word;
                                          word-break: break-word;
                                          padding: 10px;
                                          font-family: 'Montserrat', sans-serif;
                                        "
                                        align="left"
                                      >
                                        <table
                                          height="0px"
                                          align="center"
                                          border="0"
                                          cellpadding="0"
                                          cellspacing="0"
                                          width="82%"
                                          style="
                                            border-collapse: collapse;
                                            table-layout: fixed;
                                            border-spacing: 0;
                                            mso-table-lspace: 0pt;
                                            mso-table-rspace: 0pt;
                                            vertical-align: top;
                                            border-top: 1px solid #9495a7;
                                            -ms-text-size-adjust: 100%;
                                            -webkit-text-size-adjust: 100%;
                                          "
                                        >
                                          <tbody>
                                            <tr style="vertical-align: top">
                                              <td
                                                style="
                                                  word-break: break-word;
                                                  border-collapse: collapse !important;
                                                  vertical-align: top;
                                                  font-size: 0px;
                                                  line-height: 0px;
                                                  mso-line-height-rule: exactly;
                                                  -ms-text-size-adjust: 100%;
                                                  -webkit-text-size-adjust: 100%;
                                                "
                                              >
                                                <span>&#160;</span>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
        
                                <table
                                  style="font-family: 'Montserrat', sans-serif"
                                  role="presentation"
                                  cellpadding="0"
                                  cellspacing="0"
                                  width="100%"
                                  border="0"
                                >
                                  <tbody>
                                    <tr>
                                      <td
                                        class="v-container-padding-padding"
                                        style="
                                          overflow-wrap: break-word;
                                          word-break: break-word;
                                          padding: 0px 10px 13px;
                                          font-family: 'Montserrat', sans-serif;
                                        "
                                        align="left"
                                      >
                                        <div
                                          style="
                                            color: #b0b1b4;
                                            line-height: 180%;
                                            text-align: center;
                                            word-wrap: break-word;
                                          "
                                        >
                                          <p style="font-size: 14px; line-height: 180%">
                                            &copy; 2022 All Rights Reserved
                                          </p>
                                        </div>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
        
                                <!--[if (!mso)&(!IE)]><!-->
                              </div>
                              <!--<![endif]-->
                            </div>
                          </div>
                          <!--[if (mso)|(IE)]></td><![endif]-->
                          <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                        </div>
                      </div>
                    </div>
        
                    <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                  </td>
                </tr>
              </tbody>
            </table>
            <!--[if mso]></div><![endif]-->
            <!--[if IE]></div><![endif]-->
          </body>
        </html>

        
        `
  };

  transport.sendMail(message, async (error, info) => {
    if (error) {
      return res.status(400).send({ "message": "Something Error in internal server" })
    }
    console.log(info)
    const exists = await verifyOTP.exists({ email: reqEmail });

    if (!exists) {
      const userOtp = new verifyOTP({
        "email": reqEmail,
        "otp": OTP
      });

      userOtp.save();

    } else {
      verifyOTP.findOneAndUpdate({ email: reqEmail }, {
        otp: OTP
      }).exec();
    }

  });
}

module.exports = sendconfirmOTP;
