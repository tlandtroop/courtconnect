const GoogleMaps = () => {
  const apiKey = process.env.GOOGLE_MAPS_API;
  const search = "sports+courts+in+Gainesville";
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="bg-gray-200 h-[600px] rounded-lg flex items-center justify-center">
        <iframe className="bg-gray-200 h-[600px] rounded-lg flex items-center justify-center" width="100%" height="100%" loading="lazy"
          src={"https://www.google.com/maps/embed/v1/search?q="+search+"&key="+apiKey} suppressHydrationWarning>
        </iframe>
      </div>
    </div>
  );
};

export default GoogleMaps;
