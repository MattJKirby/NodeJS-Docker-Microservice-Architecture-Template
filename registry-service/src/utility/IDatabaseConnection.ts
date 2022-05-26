export interface IDatabaseConnection<TDatabaseType> {
    hostname: string
    databaseName: string
    port: number
    connection: Promise<TDatabaseType>

    initaliseDbConnection: () => void
}