const baseEndpoint = "https://book.txgb.co.uk/v4";

const serviceEndpoint = `${baseEndpoint}/Services`;
const pageEndpoint = `${baseEndpoint}/Pages`;

const endpoints = {
  search: `${serviceEndpoint}/EntityService.jsws/Search`,
  injection: `${serviceEndpoint}/Injection.aspx`,
  searchPage: `${pageEndpoint}/Search.aspx`,
  bookingQuote: `${serviceEndpoint}/BookingService.jsws/GetBookingQuote`,
};

const body = (type, distributor, lang) => {
  const request = {
    Campaign: {
      AdCampaignCode: "",
      DealCampaignCode: "",
    },
    Filter: {
      Type: `${type}`,
      MustBeInAdCampaign: true,
      MustBeInDealCampaign: false,
    },
    Language: `en-US`,
    Output: {
      CommonContent: {
        All: true,
        Images: true,
      },
      Geocodes: {
        Types: {
          Type: 4,
        },
      },
    },
    Paging: {
      PageNumber: 1,
      PageSize: 20,
    },
    ShortName: `${distributor}`,
  };

  return request;
};

const OREndpoint = "https://api.visitnara.jp/api";

export default { endpoints, OREndpoint, body };
