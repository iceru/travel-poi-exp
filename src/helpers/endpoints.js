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
    Filter: {
      Type: `${type}`,
      MustBeInAdCampaign: false,
      MustBeInDealCampaign: false,
    },
    Language: `en-US`,
    Output: {
      CommonContent: {
        All: true,
      },
      Geocodes: {
        Types: {
          Type: 4,
        },
      },
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
    AdvancedContent: true,
    Features: true,
    Rating: true,
    Children: {
      Filter: {
        Ids: null,
        Type: 4,
      },
      Output: {
        CommonContent: {
          All: true
        },
        Features: true,
        Rating: true,
        Reviews: {
          IncludeFullDescription: true,
          IncludeShortReview: true,
          MaxReturnCount: 10,
          MaxReturnCountSpecified: true
        },
        Availability: {
          StartDate: "2022-05-20T03:02:35.340Z",
          NumberOfDays: 7,
          MergeMethod: 2,
          FlagCampaign: true
        }
      },
      Children: {
        Filter: {
          Ids: null,
          Type: 4
        }
      },
    },
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

const quoteRequest = {
  request: {
    CurrentCurrency: "USD",
    AdCampaignCode: "",
    IncludeCampaigns: false,
    IncludeExtras: true,
    IndustryCategoryGroup: null,
    IndustryCategory: null,
    CommencementDate: new Date(),
    Duration: 1,
    Configurations: [
      {
        Id: "",
        ProductId: "",
        Pax: {
          Adults: 1,
          Children: 0,
          Seniors: 0,
        },
      },
    ],
    Shortname: 'TestDistributor',
  },
};

export default { endpoints, body, bodyServices, quoteRequest };
