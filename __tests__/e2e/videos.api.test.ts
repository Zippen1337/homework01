import request = require('supertest')

import {app} from '../../src/settings'

const videos = [
    {
        id: 1,
        title: "Title1",
        author: "Author1",
        canBeDownloaded: true,
        minAgeRestriction: null,
        createdAt: "2023-11-07T18:49:23.113Z",
        publicationDate: "2023-11-07T18:49:23.113Z",
        availableResolutions: [
            "P144"
        ]
    },
    {
        id: 2,
        title: "Title2",
        author: "Author2",
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: "2023-11-07T18:49:23.113Z",
        publicationDate: "2023-11-07T18:49:23.113Z",
        availableResolutions: [
            "P144"
        ]
    }
]

describe('/videos', () => {

    it('should return all videos', async () => {
        await request(app)
            .get('/videos')
            .expect(200, videos)
    })

    it('should return video by id', async () => {
        await request(app)
            .get('/videos/2')
            .expect(200,videos[1])
    })

    it('should not return video by incorrect id', async () => {
        await request(app)
            .get('/videos/3')
            .expect(404)
    })

    it('should create a new video', async () => {
        await request(app)
            .post('/videos')
            .send({
                title: 'string',
                author: 'string',
                availableResolutions: ['P144']
            })
            .expect(201)
    })

    it('should not create a new video with incorrect title', async () => {
        await request(app)
            .post('/videos')
            .send({
                title: '              ',
                author: 'string'
            })
            .expect(400, {
                errorsMessages: [
                    {
                        message: 'Invalid title',
                        field: 'title'
                    }
                ]
            })
    })

    it('should not create a new video with incorrect author', async () => {
        await request(app)
            .post('/videos')
            .send({
                title: 'title',
                author: '     '
            })
            .expect(400, {
                errorsMessages: [
                    {
                        message: 'Invalid author',
                        field: 'author'
                    }
                ]
            })
    })

    it('should create a new video with nullable resolutions', async () => {
        await request(app)
            .post('/videos')
            .send({
                title: 'title',
                author: 'author',
                availableResolutions: ['WRONG RESOLUTION']
            })
            .expect(400, {
                errorsMessages: [
                    {
                        message: 'Invalid availableResolutions',
                        field: 'availableResolutions'
                    }
                ]
            })
    })

    it('should create a new video with resolutions', async () => {
        await request(app)
            .post('/videos')
            .send({
                title: 'title',
                author: 'author',
                availableResolutions: ['P144']
            })
            .expect(201)
    })

    it('should update video with correct input', async () => {
        await request(app)
            .put('/videos/1')
            .send({
                title: 'title',
                author: 'author',
                availableResolutions: ['P144'],
                canBeDownloaded: true,
                minAgeRestriction: 16,
                publicationDate: 'DATE'
            })
            .expect(204)
    })
    it('should not update video with incorrect title', async () => {
        await request(app)
            .put('/videos/1')
            .send({
                title: '    ',
                author: 'author',
                availableResolutions: ['P144'],
                canBeDownloaded: true,
                minAgeRestriction: 16,
                publicationDate: 'DATE'
            })
            .expect(400)
    })

    it('should not update video with incorrect author', async () => {
        await request(app)
            .put('/videos/1')
            .send({
                title: 'title',
                author: '    ',
                availableResolutions: ['P144'],
                canBeDownloaded: true,
                minAgeRestriction: 16,
                publicationDate: 'DATE'
            })
            .expect(400)
    })

    it('should not update video with incorrect resoluiton', async () => {
        await request(app)
            .put('/videos/1')
            .send({
                title: 'title',
                author: 'author',
                availableResolutions: ['WRONG'],
                canBeDownloaded: true,
                minAgeRestriction: 16,
                publicationDate: 'DATE'
            })
            .expect(400)
    })

    it('should not update video with incorrect ageRestriction', async () => {
        await request(app)
            .put('/videos/1')
            .send({
                title: 'title',
                author: 'author',
                availableResolutions: ['WRONG'],
                canBeDownloaded: true,
                minAgeRestriction: 20,
                publicationDate: 'DATE'
            })
            .expect(400)
    })

    it('should not update video with incorrect canBeDownloaded', async () => {
        await request(app)
            .put('/videos/1')
            .send({
                title: 'title',
                author: 'author',
                availableResolutions: ['P144'],
                canBeDownloaded: 'yes',
                minAgeRestriction: 16,
                publicationDate: 'DATE'
            })
            .expect(400)
    })

    it('should not update video with incorrect publicationDate', async () => {
        await request(app)
            .put('/videos/1')
            .send({
                title: 'title',
                author: 'author',
                availableResolutions: ['P144'],
                canBeDownloaded: false,
                minAgeRestriction: 16,
                publicationDate: 12345
            })
            .expect(400)
    })

    it('should delete a video by id', async () => {
        await request(app)
            .delete('/videos/1')
            .expect(204)
    })

    it('should not delete a video by incorrect id', async () => {
        await request(app)
            .delete('/videos/4')
            .expect(404)
    })

    it('should delete all data', async () => {
        await request(app)
            .delete('/testing/all-data')
            .expect(204)
    })

})