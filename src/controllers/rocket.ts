import { Rocket } from "@entity/Rocket";
import { RouteHandlerMethod } from "fastify";
import { MultipartFile, MultipartValue } from "@fastify/multipart";
import * as fs from "fs";
import { randomUUID } from "crypto";

interface RocketData {
  name: MultipartValue<string>;
  description: MultipartValue<string>;
  height: MultipartValue<number>;
  diameter: MultipartValue<number>;
  mass: MultipartValue<number>;
  photo?: MultipartFile;
}

export const createRocket: RouteHandlerMethod = async (request, reply) => {
  const { name, description, height, diameter, mass, photo } = request.body as RocketData;

  const repository = request.server.db.getRepository(Rocket);

  let path = '';
  if (photo) {
    const buffer = await photo.toBuffer();
    path = `uploads/images/gallery/${randomUUID() + "_" + photo.filename}`;

    fs.appendFileSync(`storage/${path}`, buffer);
  }

  const newRocket = repository.create({
    name: name.value,
    description: description.value,
    height: height.value,
    diameter: diameter.value,
    mass: mass.value,
    photo: path,
  });

  const { id } = await repository.save(newRocket);

  return await repository.findOne({
    where: { id }
  });
}

export const updateRocket: RouteHandlerMethod = async (request, reply) => {
  const {
    name,
    description,
    height,
    diameter,
    mass,
    photo,
  } = <RocketData>request.body;

  const { rocketId } = request.params as { rocketId: number };

  const repository = request.server.db.getRepository(Rocket);;
  const rocket = await repository.findOne({ 
    where: {id: rocketId}
  });

  if (!rocket) {
    reply.notFound("Rocket not found!")
    return;
  }

  let path = rocket.photo;

  if (photo) {
    const buffer = await photo.toBuffer();

    path = `uploads/images/avatars/${randomUUID() + "_" + photo.filename}`;

    fs.appendFileSync(`storage/${path}`, buffer);

    path = "assets/" + path;
  }

  const newRocket = {
    name: name.value,
    description: description.value,
    height: height.value,
    diameter: diameter.value,
    mass: mass.value,
    photo: path,
  }

  const updated = await repository.save(newRocket);

  reply.send(updated);
};

export const rocketList: RouteHandlerMethod = async (request, reply) => {
  const repository = request.server.db.getRepository(Rocket);

  return await repository.find();
}

export const deleteRocket: RouteHandlerMethod = async (request, reply) => {
  const repository = request.server.db.getRepository(Rocket);

  const { rocketId } =  request.params as { rocketId: number };

  return await repository.delete(rocketId)
}