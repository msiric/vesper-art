import MultiChipInput from "@controls/MultiChipInput";
import { useDebouncedValue } from "@hooks/useDebouncedValue";
import { Box } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { featureFlags, upload } from "../../../../common/constants";
import { formatBytes } from "../../../../common/helpers";
import UploadPopover from "../../components/UploadPopover";
import { useUserStore } from "../../contexts/global/user";
import ImageInput from "../../controls/ImageInput/index";
import PriceInput from "../../controls/PriceInput/index";
import SelectInput from "../../controls/SelectInput/index";
import TextInput from "../../controls/TextInput/index";

const debounce = (fn, delay) => {
  let timeout;

  const debounced = (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };

  return debounced;
};

const tagList = [
  "Aberdeen",
  "Abilene",
  "Akron",
  "Albany",
  "Albuquerque",
  "Alexandria",
  "Allentown",
  "Amarillo",
  "Anaheim",
  "Anchorage",
  "Ann Arbor",
  "Antioch",
  "Apple Valley",
  "Appleton",
  "Arlington",
  "Arvada",
  "Asheville",
  "Athens",
  "Atlanta",
  "Atlantic City",
  "Augusta",
  "Aurora",
  "Austin",
  "Bakersfield",
  "Baltimore",
  "Barnstable",
  "Baton Rouge",
  "Beaumont",
  "Bel Air",
  "Bellevue",
  "Berkeley",
  "Bethlehem",
  "Billings",
  "Birmingham",
  "Bloomington",
  "Boise",
  "Boise City",
  "Bonita Springs",
  "Boston",
  "Boulder",
  "Bradenton",
  "Bremerton",
  "Bridgeport",
  "Brighton",
  "Brownsville",
  "Bryan",
  "Buffalo",
  "Burbank",
  "Burlington",
  "Cambridge",
  "Canton",
  "Cape Coral",
  "Carrollton",
  "Cary",
  "Cathedral City",
  "Cedar Rapids",
  "Champaign",
  "Chandler",
  "Charleston",
  "Charlotte",
  "Chattanooga",
  "Chesapeake",
  "Chicago",
  "Chula Vista",
  "Cincinnati",
  "Clarke County",
  "Clarksville",
  "Clearwater",
  "Cleveland",
  "College Station",
  "Colorado Springs",
  "Columbia",
  "Columbus",
  "Concord",
  "Coral Springs",
  "Corona",
  "Corpus Christi",
  "Costa Mesa",
  "Dallas",
  "Daly City",
  "Danbury",
  "Davenport",
  "Davidson County",
  "Dayton",
  "Daytona Beach",
  "Deltona",
  "Denton",
  "Denver",
  "Des Moines",
  "Detroit",
  "Downey",
  "Duluth",
  "Durham",
  "El Monte",
  "El Paso",
  "Elizabeth",
  "Elk Grove",
  "Elkhart",
  "Erie",
  "Escondido",
  "Eugene",
  "Evansville",
  "Fairfield",
  "Fargo",
  "Fayetteville",
  "Fitchburg",
  "Flint",
  "Fontana",
  "Fort Collins",
  "Fort Lauderdale",
  "Fort Smith",
  "Fort Walton Beach",
  "Fort Wayne",
  "Fort Worth",
  "Frederick",
  "Fremont",
  "Fresno",
  "Fullerton",
  "Gainesville",
  "Garden Grove",
  "Garland",
  "Gastonia",
  "Gilbert",
  "Glendale",
  "Grand Prairie",
  "Grand Rapids",
  "Grayslake",
  "Green Bay",
  "GreenBay",
  "Greensboro",
  "Greenville",
  "Gulfport-Biloxi",
  "Hagerstown",
  "Hampton",
  "Harlingen",
  "Harrisburg",
  "Hartford",
  "Havre de Grace",
  "Hayward",
  "Hemet",
  "Henderson",
  "Hesperia",
  "Hialeah",
  "Hickory",
  "High Point",
  "Hollywood",
  "Honolulu",
  "Houma",
  "Houston",
  "Howell",
  "Huntington",
  "Huntington Beach",
  "Huntsville",
  "Independence",
  "Indianapolis",
  "Inglewood",
  "Irvine",
  "Irving",
  "Jackson",
  "Jacksonville",
  "Jefferson",
  "Jersey City",
  "Johnson City",
  "Joliet",
  "Kailua",
  "Kalamazoo",
  "Kaneohe",
  "Kansas City",
  "Kennewick",
  "Kenosha",
  "Killeen",
  "Kissimmee",
  "Knoxville",
  "Lacey",
  "Lafayette",
  "Lake Charles",
  "Lakeland",
  "Lakewood",
  "Lancaster",
  "Lansing",
  "Laredo",
  "Las Cruces",
  "Las Vegas",
  "Layton",
  "Leominster",
  "Lewisville",
  "Lexington",
  "Lincoln",
  "Little Rock",
  "Long Beach",
  "Lorain",
  "Los Angeles",
  "Louisville",
  "Lowell",
  "Lubbock",
  "Macon",
  "Madison",
  "Manchester",
  "Marina",
  "Marysville",
  "McAllen",
  "McHenry",
  "Medford",
  "Melbourne",
  "Memphis",
  "Merced",
  "Mesa",
  "Mesquite",
  "Miami",
  "Milwaukee",
  "Minneapolis",
  "Miramar",
  "Mission Viejo",
  "Mobile",
  "Modesto",
  "Monroe",
  "Monterey",
  "Montgomery",
  "Moreno Valley",
  "Murfreesboro",
  "Murrieta",
  "Muskegon",
  "Myrtle Beach",
  "Naperville",
  "Naples",
  "Nashua",
  "Nashville",
  "New Bedford",
  "New Haven",
  "New London",
  "New Orleans",
  "New York",
  "New York City",
  "Newark",
  "Newburgh",
  "Newport News",
  "Norfolk",
  "Normal",
  "Norman",
  "North Charleston",
  "North Las Vegas",
  "North Port",
  "Norwalk",
  "Norwich",
  "Oakland",
  "Ocala",
  "Oceanside",
  "Odessa",
  "Ogden",
  "Oklahoma City",
  "Olathe",
  "Olympia",
  "Omaha",
  "Ontario",
  "Orange",
  "Orem",
  "Orlando",
  "Overland Park",
  "Oxnard",
  "Palm Bay",
  "Palm Springs",
  "Palmdale",
  "Panama City",
  "Pasadena",
  "Paterson",
  "Pembroke Pines",
  "Pensacola",
  "Peoria",
  "Philadelphia",
  "Phoenix",
  "Pittsburgh",
  "Plano",
  "Pomona",
  "Pompano Beach",
  "Port Arthur",
  "Port Orange",
  "Port Saint Lucie",
  "Port St. Lucie",
  "Portland",
  "Portsmouth",
  "Poughkeepsie",
  "Providence",
  "Provo",
  "Pueblo",
  "Punta Gorda",
  "Racine",
  "Raleigh",
  "Rancho Cucamonga",
  "Reading",
  "Redding",
  "Reno",
  "Richland",
  "Richmond",
  "Richmond County",
  "Riverside",
  "Roanoke",
  "Rochester",
  "Rockford",
  "Roseville",
  "Round Lake Beach",
  "Sacramento",
  "Saginaw",
  "Saint Louis",
  "Saint Paul",
  "Saint Petersburg",
  "Salem",
  "Salinas",
  "Salt Lake City",
  "San Antonio",
  "San Bernardino",
  "San Buenaventura",
  "San Diego",
  "San Francisco",
  "San Jose",
  "Santa Ana",
  "Santa Barbara",
  "Santa Clara",
  "Santa Clarita",
  "Santa Cruz",
  "Santa Maria",
  "Santa Rosa",
  "Sarasota",
  "Savannah",
  "Scottsdale",
  "Scranton",
  "Seaside",
  "Seattle",
  "Sebastian",
  "Shreveport",
  "Simi Valley",
  "Sioux City",
  "Sioux Falls",
  "South Bend",
  "South Lyon",
  "Spartanburg",
  "Spokane",
  "Springdale",
  "Springfield",
  "St. Louis",
  "St. Paul",
  "St. Petersburg",
  "Stamford",
  "Sterling Heights",
  "Stockton",
  "Sunnyvale",
  "Syracuse",
  "Tacoma",
  "Tallahassee",
  "Tampa",
  "Temecula",
  "Tempe",
  "Thornton",
  "Thousand Oaks",
  "Toledo",
  "Topeka",
  "Torrance",
  "Trenton",
  "Tucson",
  "Tulsa",
  "Tuscaloosa",
  "Tyler",
  "Utica",
  "Vallejo",
  "Vancouver",
  "Vero Beach",
  "Victorville",
  "Virginia Beach",
  "Visalia",
  "Waco",
  "Warren",
  "Washington",
  "Waterbury",
  "Waterloo",
  "West Covina",
  "West Valley City",
  "Westminster",
  "Wichita",
  "Wilmington",
  "Winston",
  "Winter Haven",
  "Worcester",
  "Yakima",
  "Yonkers",
  "York",
  "Youngstown",
];

const ArtworkForm = ({
  preview,
  errors,
  setValue,
  trigger,
  getValues,
  watchables,
  editable,
  loading,
}) => {
  const onboarded = useUserStore((state) => state.onboarded);

  const [input, setInput] = useState("");
  const [fetching, setFetching] = useState(false);
  const [tags, setTags] = useState([]);
  const debouncedValue = useDebouncedValue(input, 1000);

  const { artworkAvailability, artworkType, artworkLicense, artworkUse } =
    watchables;

  // FEATURE FLAG - stripe
  const isDisabled = !featureFlags.stripe || !onboarded;

  async function stall(stallTime = 3000) {
    await new Promise((resolve) => setTimeout(resolve, stallTime));
  }

  const fetchTags = async () => {
    if (!input) {
      setTags([]);
      setFetching(false);
      return;
    }
    setFetching(true);
    await stall(2000);
    const filteredTags = tagList.filter((item) =>
      item.toLowerCase().includes(input.toLowerCase())
    );
    setTags(filteredTags);
    setFetching(false);
  };

  const debouncedFetchTags = debounce(fetchTags);

  useEffect(() => {
    debouncedFetchTags();
  }, [input]);

  return (
    <Box>
      <ImageInput
        name="artworkMedia"
        title="Artwork media"
        setValue={setValue}
        trigger={trigger}
        errors={errors}
        preview={preview}
        shape="square"
        variant="square"
        height={400}
        width="100%"
        noEmpty={false}
        editable={editable}
        isDynamic
        loading={loading}
      />
      {editable && (
        <UploadPopover
          label="What kind of file to upload?"
          size={formatBytes(upload.artwork.fileSize)}
          type="artwork"
          dimensions={{
            height: upload.artwork.fileDimensions.height,
            width: upload.artwork.fileDimensions.width,
          }}
          aspectRatio={upload.artwork.fileRatio}
          types={upload.artwork.mimeTypes}
          loading={loading}
        />
      )}
      <Box>
        <TextInput
          name="artworkTitle"
          type="text"
          label="Artwork title"
          errors={errors}
          loading={loading}
        />
        <SelectInput
          name="artworkAvailability"
          label="Artwork availability"
          errors={errors}
          options={[
            { value: "" },
            {
              value: "available",
              text: "Available for download",
            },
            { value: "unavailable", text: "Only for preview" },
          ]}
          loading={loading}
        />
        {artworkAvailability === "available" && (
          <SelectInput
            name="artworkType"
            label="Artwork type"
            errors={errors}
            options={[
              { value: "" },
              {
                value: "commercial",
                text: "Commercial",
                disabled: isDisabled,
              },
              { value: "free", text: "Free" },
            ]}
            loading={loading}
          />
        )}
        {artworkAvailability === "available" && (
          <SelectInput
            name="artworkLicense"
            label="Artwork license"
            errors={errors}
            options={[
              { value: "" },
              { value: "commercial", text: "Commercial" },
              { value: "personal", text: "Personal" },
            ]}
            loading={loading}
          />
        )}
        {artworkAvailability === "available" && artworkType === "commercial" && (
          <PriceInput
            name="artworkPersonal"
            value={getValues("artworkPersonal")}
            setValue={setValue}
            trigger={trigger}
            label="Personal license price"
            errors={errors}
            loading={loading}
          />
          /*             <TextInput
              name="artworkPersonal"
              type="text"
              label="Personal license price"
              adornment="$"
              errors={errors}
              loading={loading}
            /> */
        )}
        {artworkAvailability === "available" &&
          artworkLicense === "commercial" && (
            <SelectInput
              name="artworkUse"
              label="Artwork use"
              errors={errors}
              options={[
                { value: "" },
                {
                  value: "separate",
                  text: "Charge commercial license separately",
                  disabled: isDisabled,
                },
                artworkAvailability === "available" &&
                artworkType === "commercial"
                  ? {
                      value: "included",
                      text: "Include commercial license in the price",
                    }
                  : {
                      value: "included",
                      text: "Offer commercial license free of charge",
                    },
              ]}
              loading={loading}
            />
          )}
        {artworkAvailability === "available" &&
          artworkLicense === "commercial" &&
          artworkUse === "separate" && (
            <PriceInput
              name="artworkCommercial"
              value={getValues("artworkCommercial")}
              setValue={setValue}
              trigger={trigger}
              label="Commercial license price"
              errors={errors}
              loading={loading}
            />
            /*             <TextInput
              name="artworkCommercial"
              type="text"
              label="Commercial license price"
              adornment="$"
              errors={errors}
              loading={loading}
            /> */
          )}
        <SelectInput
          name="artworkVisibility"
          label="Artwork visibility"
          errors={errors}
          options={[
            { value: "" },
            {
              value: "visible",
              text: "Visible to everyone",
            },
            { value: "invisible", text: "Hidden to public" },
          ]}
          loading={loading}
        />
        <MultiChipInput
          name="artworkTags"
          label="Artwork tags"
          errors={errors}
          options={tags}
          loading={loading}
          fetching={fetching}
          setInput={setInput}
          setValue={setValue}
        />
        <TextInput
          name="artworkDescription"
          type="text"
          label="Artwork description"
          errors={errors}
          multiline
          loading={loading}
        />
        {/* <TagInput
          name="artworkTags"
          trigger={trigger}
          value={getValues("artworkTags")}
          label="Artwork tags"
          errors={errors}
          handleChange={(e, item) => setValue("artworkTags", item || [])}
          limit={5}
          multiline
        /> */}
      </Box>
    </Box>
  );
};

export default ArtworkForm;
