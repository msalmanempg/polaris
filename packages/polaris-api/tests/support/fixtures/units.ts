import { Project, Unit } from "@prisma/client";

export const units: Partial<Unit>[] = [
  {
    unitNumber: "unit-a",
    location: "Block A, Street 5",
    type: "residential",
    bed: 3,
    basePrice: 5000000,
    publishedPrice: 5500000,
    netArea: 1250,
    grossArea: 1250,
    status: "available",
    completionDate: new Date("2021-02-19T05:20:07.269Z"),
    createdAt: new Date("2021-02-19T05:20:01.269Z"),
    updatedAt: new Date("2021-02-19T05:20:07.269Z"),
  },
  {
    unitNumber: "unit-b",
    location: "Block B, Street 6",
    type: "residential",
    bed: 6,
    basePrice: 10000000,
    publishedPrice: 10000000,
    netArea: 2500,
    grossArea: 2500,
    status: "booked",
    completionDate: new Date("2021-02-19T05:20:07.269Z"),
    createdAt: new Date("2021-02-19T05:20:02.269Z"),
    updatedAt: new Date("2021-02-19T05:20:07.269Z"),
  },
];

export const projects: Partial<Project>[] = [
  {
    name: "Project 1 for units",
    address: "Gulberg",
    city: "Lahore",
    province: "Punjab",
    country: "Pakistan",
    longitude: 3.14678,
    latitude: 0.36745,
    email: "project1@zameen.com",
    phone: "+923007651324",
    url: "https://www.zameen.com",
    logo:
      "http://gdj.graphicdesignjunction.com/wp-content/uploads/2012/07/business-logo-design-4.jpg",
    completionDate: new Date("2021-02-19T05:20:07.269Z"),
    createdAt: new Date("2021-02-19T05:20:01.269Z"),
    updatedAt: new Date("2021-02-19T05:20:07.269Z"),
  },
];
