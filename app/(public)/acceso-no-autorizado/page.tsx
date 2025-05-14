import Banner from "../../../components/index/banner";

export default function Page() {
  return (
    <main className="rounded-sm border border-stroke bg-white shadow-default ">
      <div className="flex flex-wrap items-center w-full">
        <Banner />
        <div className="p-6  w-full xl:w-1/2 h-100 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-red-600 text-2xl font-bold">
              Acceso No Autorizado
            </h1>
            <p className="text-gray-700 mt-4 text-lg">
              No estas autorizado para poder ver esta página
            </p>
            <p className="text-gray-500 mt-2 text-sm">
              Si crees que esto es un error, por favor contacta con el
              administrador.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
