const GoogleMaps = ({ searchValue }: any) => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API;
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="bg-gray-200 h-[600px] rounded-lg flex items-center justify-center">
        <iframe
          className="bg-gray-200 h-[600px] rounded-lg flex items-center justify-center"
          width="100%"
          height="100%"
          loading="lazy"
          src={
            "https://www.google.com/maps/embed/v1/search?q=" +
            searchValue +
            "&key=" +
            apiKey
          }
          suppressHydrationWarning
        ></iframe>
      </div>
    </div>
  );
};

export default GoogleMaps;
