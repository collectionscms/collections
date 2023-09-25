import express, { Request, Response } from 'express';
import { RecordNotFoundException } from '../../exceptions/database/recordNotFound.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { modelExists } from '../middleware/modelExists.js';
import { modelPermissionsHandler } from '../middleware/permissionsHandler.js';
import { ContentsService } from '../services/contents.js';

const router = express.Router();

router.get(
  '/models/:modelId/contents',
  modelExists,
  modelPermissionsHandler('read'),
  asyncHandler(async (req: Request, res: Response) => {
    const { model: model, singleton } = req.model;

    const service = new ContentsService(model, { schema: req.schema });
    const contents = await service.getContents(req.appAccess || false, req.model);

    if (singleton) {
      res.json({ data: contents[0] });
    } else {
      res.json({ data: contents });
    }
  })
);

router.get(
  '/models/:modelId/contents/:id',
  modelExists,
  modelPermissionsHandler('read'),
  asyncHandler(async (req: Request, res: Response) => {
    const { model: model } = req.model;
    const id = Number(req.params.id);

    const service = new ContentsService(model, { schema: req.schema });
    const content = await service
      .getContents(req.appAccess || false, req.model, id)
      .then((contents) => contents[0]);

    if (!content) throw new RecordNotFoundException('record_not_found');

    res.json({
      data: content,
    });
  })
);

router.post(
  '/models/:modelId/contents',
  modelExists,
  modelPermissionsHandler('create'),
  asyncHandler(async (req: Request, res: Response) => {
    const { model: model } = req.model;

    const contentsService = new ContentsService(model, { schema: req.schema });
    const contentId = await contentsService.createContent(
      req.body,
      Object.values(req.model.fields)
    );

    res.json({
      id: contentId,
    });
  })
);

router.patch(
  '/models/:modelId/contents/:id',
  modelExists,
  modelPermissionsHandler('update'),
  asyncHandler(async (req: Request, res: Response) => {
    const { model: model } = req.model;
    const id = Number(req.params.id);

    const contentsService = new ContentsService(model, { schema: req.schema });
    await contentsService.updateContent(id, req.body, Object.values(req.model.fields));

    res.status(204).end();
  })
);

router.delete(
  '/models/:modelId/contents/:id',
  modelExists,
  modelPermissionsHandler('delete'),
  asyncHandler(async (req: Request, res: Response) => {
    const { model: model } = req.model;
    const id = Number(req.params.id);

    const contentsService = new ContentsService(model, { schema: req.schema });
    await contentsService.deleteContent(id);

    res.status(204).end();
  })
);

export const contents = router;
