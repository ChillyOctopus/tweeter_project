export abstract class AbstractS3Dao {
  abstract putImage(fileName: string, imageStringBase64Encoded: string): Promise<string>
}