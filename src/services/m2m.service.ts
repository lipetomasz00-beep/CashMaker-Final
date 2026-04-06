export const m2mService = {
  async sendData(data: any) {
    console.log("Dane wysłane do M2M:", data);
    return { success: true };
  }
};
