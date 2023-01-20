package com.clinic.bookingsystem.Services;

import com.clinic.bookingsystem.Model.ModelClass;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ExecutionException;

@Service
public class ServiceClass {
    Firestore firestore = FirestoreClient.getFirestore();

    public String createAppointment(ModelClass modelClass) throws ExecutionException, InterruptedException {
        ApiFuture<WriteResult> collectionsApiFuture = firestore.collection("patient-appointments").document(modelClass.getAppointmentID()).set(modelClass);

        return collectionsApiFuture.get().getUpdateTime().toString();
    }

    public HashSet<Object> getAllAppointments() throws ExecutionException, InterruptedException {
        ApiFuture<QuerySnapshot> future = firestore.collection("patient-appointments").get();
        List<QueryDocumentSnapshot> documents = future.get().getDocuments();

        HashSet<Object> set = new HashSet<>();

        if (!documents.isEmpty()) {
            for(QueryDocumentSnapshot document : documents)
                set.add(document.toObject(ModelClass.class));

            return set;
        }
        return null;
    }

    public String updateAppointment(ModelClass modelClass) throws ExecutionException, InterruptedException {
        ApiFuture<WriteResult> writeResultApiFuture = firestore.collection("patient-appointments").document(modelClass.getAppointmentID()).set(modelClass);

        return writeResultApiFuture.get().getUpdateTime().toString();
    }

    public String deleteAppointment(String documentID) {
        ApiFuture<WriteResult> writeResultApiFuture = firestore.collection("patient-appointments").document(documentID).delete();
        return "Successfully deleted " + documentID;
    }

    public ModelClass getSpecificAppointment(String documentID) throws ExecutionException, InterruptedException {
        DocumentReference documentReference = (DocumentReference) firestore.collection("patient-appointments").document(documentID);
        ApiFuture<DocumentSnapshot> future = documentReference.get();

        DocumentSnapshot documentSnapshot = future.get();

        ModelClass modelClass;

        if(documentSnapshot.exists()){
            modelClass = documentSnapshot.toObject(ModelClass.class);
            return modelClass;
        }
        return null;
    }
}
