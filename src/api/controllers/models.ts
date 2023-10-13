import express, { Request, Response } from 'express';
import { RecordNotFoundException } from '../../exceptions/database/recordNotFound.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { multipartHandler } from '../middleware/multipartHandler.js';
import { permissionsHandler } from '../middleware/permissionsHandler.js';
import { ModelsService } from '../services/models.js';
import { FilesService } from '../services/files.js';
import { ImportDataService } from '../services/importData.js';

const router = express.Router();

router.get(
  '/models/:id',
  permissionsHandler(),
  asyncHandler(async (req: Request, res: Response) => {
    const service = new ModelsService({ schema: req.schema });
    const model = await service.readOne(Number(req.params.id));
    if (!model) throw new RecordNotFoundException('record_not_found');

    res.json({
      model: {
        ...model,
      },
    });
  })
);

router.get(
  '/models',
  permissionsHandler(),
  asyncHandler(async (req: Request, res: Response) => {
    const service = new ModelsService({ schema: req.schema });
    const models = await service.readMany({});

    res.json({ models });
  })
);

router.post(
  '/models',
  permissionsHandler([{ model: 'CollectionsModels', action: 'create' }]),
  asyncHandler(async (req: Request, res: Response) => {
    const { ['status']: status, ...data } = req.body;

    const service = new ModelsService({ schema: req.schema });
    const modelId = await service.createModel(data, status || false);

    res.json({ id: modelId });
  })
);

router.patch(
  '/models/:id',
  permissionsHandler([{ model: 'CollectionsModels', action: 'update' }]),
  asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const service = new ModelsService({ schema: req.schema });
    await service.updateModel(id, req.body);

    res.status(204).end();
  })
);

router.delete(
  '/models/:id',
  permissionsHandler([{ model: 'CollectionsModels', action: 'delete' }]),
  asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const service = new ModelsService({ schema: req.schema });
    await service.deleteModel(id);

    res.status(204).end();
  })
);

router.post(
  '/models/import',
  asyncHandler(multipartHandler),
  permissionsHandler([{ model: 'CollectionsModels', action: 'create' }]),
  asyncHandler(async (req: Request, res: Response) => {
    const keys = res.locals.savedFileKeys;
    const filesService = new FilesService({ schema: req.schema });
    const file = await filesService.readOne(keys[0]);

    const fileData = res.locals.fileData;
    const importDataService = new ImportDataService({ schema: req.schema });
    await importDataService.importData(file.type, fileData);

    return res.status(200).end();
  })
);

export const models = router;
