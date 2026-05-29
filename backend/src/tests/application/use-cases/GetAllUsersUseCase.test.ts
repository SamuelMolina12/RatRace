import { GetAllUsersUseCase } from "../../../application/use-cases/admin/GetAllUsersUseCase";

describe("GetAllUsersUseCase", () => {

    let mockUserRepository: any;

    let getAllUsersUseCase: GetAllUsersUseCase;

    beforeEach(() => {

        mockUserRepository = {
            findAll: jest.fn(),
            countAll: jest.fn(),
        };

        getAllUsersUseCase = new GetAllUsersUseCase(
            mockUserRepository
        );

    });

    describe("execute", () => {

        test("should return all users successfully", async () => {

            mockUserRepository.findAll.mockResolvedValue([
                {
                    id: "1",
                    username: "Samuel",
                    email: "samuel@gmail.com",
                    role: "PILOT",
                },
                {
                    id: "2",
                    username: "Carlos",
                    email: "carlos@gmail.com",
                    role: "ADMIN",
                },
            ]);

            mockUserRepository.countAll.mockResolvedValue(2);

            const result = await getAllUsersUseCase.execute();

            expect(result).toEqual({
                users: [
                    {
                        id: "1",
                        username: "Samuel",
                        email: "samuel@gmail.com",
                        role: "PILOT",
                    },
                    {
                        id: "2",
                        username: "Carlos",
                        email: "carlos@gmail.com",
                        role: "ADMIN",
                    },
                ],
                pagination: {
                    page: 1,
                    pageSize: 20,
                    total: 2,
                    pages: 1,
                },
            });

            expect(mockUserRepository.findAll)
                .toHaveBeenCalledWith(1, 20);

            expect(mockUserRepository.countAll)
                .toHaveBeenCalled();

        });

        test("should apply pagination correctly", async () => {

            mockUserRepository.findAll.mockResolvedValue([]);

            mockUserRepository.countAll.mockResolvedValue(50);

            const result = await getAllUsersUseCase.execute(2, 10);

            expect(mockUserRepository.findAll)
                .toHaveBeenCalledWith(2, 10);

            expect(result.pagination).toEqual({
                page: 2,
                pageSize: 10,
                total: 50,
                pages: 5,
            });

        });

        test("should return empty users list when no users exist", async () => {

            mockUserRepository.findAll.mockResolvedValue([]);

            mockUserRepository.countAll.mockResolvedValue(0);

            const result = await getAllUsersUseCase.execute();

            expect(result).toEqual({
                users: [],
                pagination: {
                    page: 1,
                    pageSize: 20,
                    total: 0,
                    pages: 0,
                },
            });

        });

    });

});