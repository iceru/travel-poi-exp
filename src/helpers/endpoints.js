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

const bodyServices = {
    Campaign: {
      AdCampaignCode: "",
      DealCampaignCode: ""
    },
    Filter: {
      Type: "3",
      MustBeInAdCampaign: true,
      MustBeInDealCampaign: false,
      Bookability: {
        GuestsCapability: 1,
        NightsCapability: 1,
        RateRange: {
          Min: 0,
          Max: 99999
        }
      },
      TagCriteria: {
        IndustryCategoryGroups: []
      }
    },
    Language: "en-US",
    Output: {
      CommonContent: {
        All: true
      },
      Availability: {
        StartDate: new Date(),
        NumberOfDays: 42,
        MergeMethod: 2,
        LowestRateOnly: true
      },
      AdvancedContent: true
    },
    Paging: {
      PageNumber: 1,
      PageSize: 12
    },
    Availability: {
      MergeMethod: 1,
      Window: {
        StartDate: new Date(),
        Size: 42
      }
    },
    ShortName: "TestDistributor"
}

export default { endpoints, body, bodyServices };
