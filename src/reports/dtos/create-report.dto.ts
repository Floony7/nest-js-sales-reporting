import { IsEmail, IsString, IsNumber, Min, Max, IsLongitude, IsLatitude } from 'class-validator';

export class CreateReportDto {
   @IsString()
   make: string;

   @IsString()
   model: string;

   @IsNumber()
   @Min(1930)
   @Max(2030)
   year: number;

   @IsNumber()
   @Min(0)
   @Max(1000000)
   mileage: number;

   @IsLongitude()
   lng: number;

   @IsLatitude()
   lat: number;

   @IsNumber()
   @Max(1000000)
   price: number;
}