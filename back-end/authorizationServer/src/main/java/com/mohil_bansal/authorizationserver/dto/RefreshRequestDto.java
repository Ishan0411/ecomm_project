package com.mohil_bansal.authorizationserver.dto;

import lombok.Data;

@Data
public class RefreshRequestDto {
    private String refreshToken;

    public String getRefreshToken() { return refreshToken; }
    public void setRefreshToken(String refreshToken) { this.refreshToken = refreshToken; }
}