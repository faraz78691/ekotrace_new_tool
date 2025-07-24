import {SendNotification} from '@/models/SendNotification';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from 'environments/environment';
import {ToastrService} from 'ngx-toastr';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    apiURL = environment.baseUrl + 'Notification';
    constructor(private toastr: ToastrService, private http: HttpClient) {}

    showSuccess(message: string, title: string) {
        this.toastr.success(message, title);
    }

    showError(message: string, title: string) {
        this.toastr.error(message, title);
    }

    showInfo(message: string, title: string) {
        this.toastr.info(message, title);
    }

    showWarning(message: string, title: string) {
        this.toastr.warning(message, title);
    }

    public SaveNotifications(notification) {
        return this.http.post<SendNotification>(this.apiURL, notification);
    }
    public GetAllNotification(
        facilityortenantId,
        recipent
    ): Observable<SendNotification[]> {
        return this.http.get<SendNotification[]>(
            environment.baseUrl +
                'Notification/getAll/' +
                facilityortenantId +
                '/' +
                recipent
        );
    }
    public UpdateNotification(id, notification) {
        return this.http.put(
            environment.baseUrl + 'Notification/' + id,
            notification
        );
    }
}
