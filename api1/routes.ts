import express from 'express';
import { FipeService } from './services/fipe-service';
import { BadRequestError } from './errors/bad-request-error';
import { param } from 'express-validator';
import { validateRequest } from './middlewares/validate-request';
const router = express.Router();

router.get('/api1/marcas/load', async (req, res) => {

    try {
        const marcas = await FipeService.loadData();
        res.status(200).send(marcas);

    } catch (error) {
        throw new BadRequestError('Alguma coisa deu errado!!!');
    }

});

router.get('/api1/marcas', async (req, res) => {
    try {
        const marcas = await FipeService.getMarcas();
        res.status(200).send(marcas);

    } catch (error) {
        throw new BadRequestError('Alguma coisa deu errado!!!');
    }

});


router.get('/api1/marcas/:codigo', async (req, res) => {
        try {
            const codigo: string = req.params.codigo;
            const marcas = await FipeService.getMarcasById(codigo);
            res.status(200).send(marcas);

        } catch (error) {
            throw new BadRequestError('Alguma coisa deu errado!!!');
        }

    });

export { router as api1Routes };  