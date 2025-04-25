interface ServiceCardProps {
  title: string;
  description: string;
  iconComponent: React.ReactNode;
}
const ServiceCard: React.FC<ServiceCardProps> = ({
  title,
  description,
  iconComponent,
}) => {
  return (
    <div className="md:w-1/2 lg:w-1/4">
      <div className="service-item mb-[30px]">
        <div className="service-icon mb-[50px]">{iconComponent}</div>
        <div className="service-content">
          <h4 className="m-0 font-raleway text-[25px] font-semibold text-[#393e46]">
            {title}
          </h4>
          <p className="m-0 text-[18px] font-normal leading-[28px] text-[#8c96a7]">
            {description}
          </p>
        </div>
        <div className="service-overlay img-bg"></div>
      </div>
    </div>
  );
};
export default ServiceCard;
